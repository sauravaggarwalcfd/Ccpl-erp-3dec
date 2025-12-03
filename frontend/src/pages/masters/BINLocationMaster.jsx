import React, { useEffect, useState } from 'react';
import { mastersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { Search, Plus, Edit, Trash2, Save, X, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const BINLocationMaster = () => {
  const [bins, setBINs] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    bin_code: '',
    bin_name: '',
    warehouse_id: '',
    aisle: '',
    rack: '',
    level: '',
    capacity: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [binsRes, whRes] = await Promise.all([
        mastersAPI.getBINLocations(),
        mastersAPI.getWarehouses()
      ]);
      setBINs(binsRes.data || []);
      setWarehouses(whRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
      setBINs([]);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bin_code.trim() || !formData.bin_name.trim() || !formData.warehouse_id) {
      toast.error('BIN Code, Name and Warehouse are required');
      return;
    }

    try {
      if (editMode) {
        toast.success('BIN location updated successfully');
      } else {
        await mastersAPI.createBINLocation(formData);
        toast.success('BIN location created successfully');
      }
      setDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save BIN location');
    }
  };

  const resetForm = () => {
    setFormData({
      bin_code: '',
      bin_name: '',
      warehouse_id: '',
      aisle: '',
      rack: '',
      level: '',
      capacity: '',
      status: 'Active'
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const filteredBINs = bins.filter(bin =>
    bin.bin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.bin_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" data-testid="bin-location-master-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-semibold tracking-tight text-neutral-900">BIN / Location Master</h1>
          <p className="text-neutral-600 mt-1">Manage bin and location details within warehouses</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="create-bin-btn" className="gap-2">
              <Plus className="h-4 w-4" />
              Create BIN
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">{editMode ? 'Edit' : 'Create'} BIN Location</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bin_code">BIN Code *</Label>
                  <Input id="bin_code" value={formData.bin_code} onChange={(e) => setFormData({ ...formData, bin_code: e.target.value })} placeholder="BIN-A01" required data-testid="bin-code-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bin_name">BIN Name *</Label>
                  <Input id="bin_name" value={formData.bin_name} onChange={(e) => setFormData({ ...formData, bin_name: e.target.value })} placeholder="Aisle A Rack 01" required data-testid="bin-name-input" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse_id">Warehouse *</Label>
                <Select value={formData.warehouse_id} onValueChange={(value) => setFormData({ ...formData, warehouse_id: value })}>
                  <SelectTrigger data-testid="warehouse-select"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map(wh => <SelectItem key={wh.id} value={wh.id}>{wh.warehouse_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aisle">Aisle</Label>
                  <Input id="aisle" value={formData.aisle} onChange={(e) => setFormData({ ...formData, aisle: e.target.value })} placeholder="A" data-testid="aisle-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rack">Rack</Label>
                  <Input id="rack" value={formData.rack} onChange={(e) => setFormData({ ...formData, rack: e.target.value })} placeholder="01" data-testid="rack-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input id="level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} placeholder="1" data-testid="level-input" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} placeholder="Storage capacity" data-testid="capacity-input" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}><X className="h-4 w-4 mr-2" />Cancel</Button>
                <Button type="submit" data-testid="save-bin-btn" className="gap-2"><Save className="h-4 w-4" />{editMode ? 'Update' : 'Save'} BIN</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input placeholder="Search BINs..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} data-testid="search-bin-input" />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50">
              <TableHead className="font-semibold">BIN Code</TableHead>
              <TableHead className="font-semibold">BIN Name</TableHead>
              <TableHead className="font-semibold">Warehouse</TableHead>
              <TableHead className="font-semibold">Aisle</TableHead>
              <TableHead className="font-semibold">Rack</TableHead>
              <TableHead className="font-semibold">Level</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-neutral-500">Loading...</TableCell></TableRow>
            ) : filteredBINs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <MapPin className="h-12 w-12 text-neutral-300" />
                    <p className="text-neutral-600 font-medium">No BIN locations found</p>
                    <p className="text-sm text-neutral-500">Click "Create BIN" to add one</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBINs.map((bin) => (
                <TableRow key={bin.id} className="hover:bg-neutral-50 transition-colors">
                  <TableCell className="font-mono text-sm">{bin.bin_code}</TableCell>
                  <TableCell className="font-medium">{bin.bin_name}</TableCell>
                  <TableCell>{bin.warehouse_name || '-'}</TableCell>
                  <TableCell>{bin.aisle || '-'}</TableCell>
                  <TableCell>{bin.rack || '-'}</TableCell>
                  <TableCell>{bin.level || '-'}</TableCell>
                  <TableCell><StatusBadge status={bin.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" data-testid={`edit-bin-${bin.id}`}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" data-testid={`delete-bin-${bin.id}`}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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

export default BINLocationMaster;