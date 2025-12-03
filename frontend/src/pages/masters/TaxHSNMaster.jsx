import React, { useEffect, useState } from 'react';
import { mastersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { Search, Plus, Edit, Trash2, Save, X, Hash } from 'lucide-react';
import { toast } from 'sonner';

const TaxHSNMaster = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    hsn_code: '',
    description: '',
    cgst_rate: '9',
    sgst_rate: '9',
    igst_rate: '18',
    cess_rate: '0',
    status: 'Active'
  });

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const response = await mastersAPI.getTaxHSN();
      setTaxes(response.data || []);
    } catch (error) {
      toast.error('Failed to load tax/HSN codes');
      setTaxes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.hsn_code.trim() || !formData.description.trim()) {
      toast.error('HSN Code and Description are required');
      return;
    }

    try {
      if (editMode) {
        toast.success('Tax/HSN updated successfully');
      } else {
        await mastersAPI.createTaxHSN({
          ...formData,
          cgst_rate: parseFloat(formData.cgst_rate) || 0,
          sgst_rate: parseFloat(formData.sgst_rate) || 0,
          igst_rate: parseFloat(formData.igst_rate) || 0,
          cess_rate: parseFloat(formData.cess_rate) || 0
        });
        toast.success('Tax/HSN created successfully');
      }
      setDialogOpen(false);
      fetchTaxes();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save tax/HSN');
    }
  };

  const resetForm = () => {
    setFormData({
      hsn_code: '',
      description: '',
      cgst_rate: '9',
      sgst_rate: '9',
      igst_rate: '18',
      cess_rate: '0',
      status: 'Active'
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const filteredTaxes = taxes.filter(tax =>
    tax.hsn_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" data-testid="tax-hsn-master-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-semibold tracking-tight text-neutral-900">Tax / HSN Master</h1>
          <p className="text-neutral-600 mt-1">Manage tax rates and HSN codes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="create-tax-btn" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Tax/HSN
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">{editMode ? 'Edit' : 'Create'} Tax/HSN</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hsn_code">HSN Code *</Label>
                  <Input id="hsn_code" value={formData.hsn_code} onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })} placeholder="6302" required data-testid="hsn-code-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Textile goods" required data-testid="description-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cgst_rate">CGST Rate (%)</Label>
                  <Select value={formData.cgst_rate} onValueChange={(value) => setFormData({ ...formData, cgst_rate: value })}>
                    <SelectTrigger data-testid="cgst-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="2.5">2.5%</SelectItem>
                      <SelectItem value="6">6%</SelectItem>
                      <SelectItem value="9">9%</SelectItem>
                      <SelectItem value="14">14%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sgst_rate">SGST Rate (%)</Label>
                  <Select value={formData.sgst_rate} onValueChange={(value) => setFormData({ ...formData, sgst_rate: value })}>
                    <SelectTrigger data-testid="sgst-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="2.5">2.5%</SelectItem>
                      <SelectItem value="6">6%</SelectItem>
                      <SelectItem value="9">9%</SelectItem>
                      <SelectItem value="14">14%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="igst_rate">IGST Rate (%)</Label>
                  <Select value={formData.igst_rate} onValueChange={(value) => setFormData({ ...formData, igst_rate: value })}>
                    <SelectTrigger data-testid="igst-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cess_rate">Cess Rate (%)</Label>
                  <Input id="cess_rate" type="number" step="0.1" value={formData.cess_rate} onChange={(e) => setFormData({ ...formData, cess_rate: e.target.value })} placeholder="0" data-testid="cess-input" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}><X className="h-4 w-4 mr-2" />Cancel</Button>
                <Button type="submit" data-testid="save-tax-btn" className="gap-2"><Save className="h-4 w-4" />{editMode ? 'Update' : 'Save'} Tax/HSN</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input placeholder="Search HSN codes..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-tax-input" />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50">
              <TableHead className="font-semibold">HSN Code</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">CGST %</TableHead>
              <TableHead className="font-semibold">SGST %</TableHead>
              <TableHead className="font-semibold">IGST %</TableHead>
              <TableHead className="font-semibold">Total GST %</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-neutral-500">Loading...</TableCell></TableRow>
            ) : filteredTaxes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Hash className="h-12 w-12 text-neutral-300" />
                    <p className="text-neutral-600 font-medium">No tax/HSN codes found</p>
                    <p className="text-sm text-neutral-500">Click "Create Tax/HSN" to add one</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTaxes.map((tax) => (
                <TableRow key={tax.id} className="hover:bg-neutral-50 transition-colors">
                  <TableCell className="font-mono text-sm">{tax.hsn_code}</TableCell>
                  <TableCell className="font-medium">{tax.description}</TableCell>
                  <TableCell className="font-mono">{tax.cgst_rate}%</TableCell>
                  <TableCell className="font-mono">{tax.sgst_rate}%</TableCell>
                  <TableCell className="font-mono">{tax.igst_rate}%</TableCell>
                  <TableCell className="font-mono font-semibold">{(tax.cgst_rate + tax.sgst_rate) || tax.igst_rate}%</TableCell>
                  <TableCell><StatusBadge status={tax.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" data-testid={`edit-tax-${tax.id}`}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" data-testid={`delete-tax-${tax.id}`}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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

export default TaxHSNMaster;