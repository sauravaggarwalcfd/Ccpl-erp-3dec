import React, { useEffect, useState } from 'react';
import { mastersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/StatusBadge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const FabricCategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    fabric_type: 'WOVEN',
    composition: '',
    gsm_range: '',
    default_width: '',
    default_uom: 'METER',
    is_knitted: false,
    shrinkage_percentage: '',
    care_instructions: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await mastersAPI.getItemCategories();
      setCategories(response.data.filter(cat => cat.inventory_type === 'RAW'));
    } catch (error) {
      toast.error('Failed to load fabric categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code.trim()) {
      toast.error('Fabric code is required');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Fabric name is required');
      return;
    }

    try {
      const payload = {
        ...formData,
        inventory_type: 'RAW',
        default_hsn: formData.code
      };

      if (editMode) {
        await mastersAPI.updateItemCategory(currentId, payload);
        toast.success('Fabric category updated successfully');
      } else {
        await mastersAPI.createItemCategory(payload);
        toast.success('Fabric category created successfully');
      }
      
      setDialogOpen(false);
      fetchCategories();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save fabric category');
    }
  };

  const handleEdit = (category) => {
    setFormData({
      code: category.code,
      name: category.name,
      fabric_type: category.fabric_type || 'WOVEN',
      composition: category.composition || '',
      gsm_range: category.gsm_range || '',
      default_width: category.default_width || '',
      default_uom: category.default_uom,
      is_knitted: category.is_knitted || false,
      shrinkage_percentage: category.shrinkage_percentage || '',
      care_instructions: category.care_instructions || '',
      status: category.status
    });
    setCurrentId(category.id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fabric category?')) {
      try {
        await mastersAPI.deleteItemCategory(id);
        toast.success('Fabric category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete fabric category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      fabric_type: 'WOVEN',
      composition: '',
      gsm_range: '',
      default_width: '',
      default_uom: 'METER',
      is_knitted: false,
      shrinkage_percentage: '',
      care_instructions: '',
      status: 'Active'
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" data-testid="fabric-category-master-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-semibold tracking-tight text-neutral-900">Fabric Category Master</h1>
          <p className="text-neutral-600 mt-1">Manage fabric categories and specifications</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="create-fabric-category-btn">
              <Plus className="h-4 w-4 mr-2" />
              Create Fabric Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit' : 'Create'} Fabric Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Fabric Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., FAB-001"
                    required
                    data-testid="fabric-code-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Fabric Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Cotton Poplin"
                    required
                    data-testid="fabric-name-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fabric_type">Fabric Type *</Label>
                  <Select value={formData.fabric_type} onValueChange={(value) => setFormData({ ...formData, fabric_type: value })}>
                    <SelectTrigger data-testid="fabric-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WOVEN">Woven</SelectItem>
                      <SelectItem value="KNITTED">Knitted</SelectItem>
                      <SelectItem value="NON_WOVEN">Non-Woven</SelectItem>
                      <SelectItem value="BLENDED">Blended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="composition">Composition</Label>
                  <Input
                    id="composition"
                    value={formData.composition}
                    onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                    placeholder="e.g., 100% Cotton"
                    data-testid="composition-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gsm_range">GSM Range</Label>
                  <Input
                    id="gsm_range"
                    value={formData.gsm_range}
                    onChange={(e) => setFormData({ ...formData, gsm_range: e.target.value })}
                    placeholder="e.g., 120-150"
                    data-testid="gsm-range-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_width">Default Width (inches)</Label>
                  <Input
                    id="default_width"
                    value={formData.default_width}
                    onChange={(e) => setFormData({ ...formData, default_width: e.target.value })}
                    placeholder="e.g., 44, 58"
                    data-testid="default-width-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_uom">Default UOM *</Label>
                  <Select value={formData.default_uom} onValueChange={(value) => setFormData({ ...formData, default_uom: value })}>
                    <SelectTrigger data-testid="uom-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="METER">Meter</SelectItem>
                      <SelectItem value="YARD">Yard</SelectItem>
                      <SelectItem value="KG">Kilogram</SelectItem>
                      <SelectItem value="ROLL">Roll</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shrinkage_percentage">Shrinkage %</Label>
                  <Input
                    id="shrinkage_percentage"
                    type="number"
                    step="0.1"
                    value={formData.shrinkage_percentage}
                    onChange={(e) => setFormData({ ...formData, shrinkage_percentage: e.target.value })}
                    placeholder="e.g., 2.5"
                    data-testid="shrinkage-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger data-testid="status-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="care_instructions">Care Instructions</Label>
                <Textarea
                  id="care_instructions"
                  value={formData.care_instructions}
                  onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
                  placeholder="e.g., Machine wash cold, tumble dry low"
                  rows={3}
                  data-testid="care-instructions-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit" data-testid="submit-fabric-category-btn">
                  {editMode ? 'Update' : 'Create'} Fabric Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search fabric categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-fabric-input"
          />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50">
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Composition</TableHead>
              <TableHead className="font-semibold">GSM Range</TableHead>
              <TableHead className="font-semibold">Width</TableHead>
              <TableHead className="font-semibold">UOM</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-neutral-500">Loading...</TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-neutral-500">No fabric categories found</TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-neutral-50 transition-colors">
                  <TableCell className="font-mono text-sm">{category.code}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.fabric_type || '-'}</TableCell>
                  <TableCell>{category.composition || '-'}</TableCell>
                  <TableCell>{category.gsm_range || '-'}</TableCell>
                  <TableCell>{category.default_width || '-'}</TableCell>
                  <TableCell>{category.default_uom}</TableCell>
                  <TableCell><StatusBadge status={category.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} data-testid={`edit-fabric-${category.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)} data-testid={`delete-fabric-${category.id}`}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FabricCategoryMaster;