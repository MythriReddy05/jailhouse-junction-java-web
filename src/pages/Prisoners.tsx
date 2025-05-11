
import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, Prison } from 'lucide-react';
import { usePrison, Prisoner } from '../context/PrisonContext';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Prisoners = () => {
  const { prisoners, cells, addPrisoner, updatePrisoner, deletePrisoner, assignPrisonerToCell } = usePrison();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<Prisoner, 'id'>>({
    firstName: '',
    lastName: '',
    age: 18,
    crime: '',
    sentenceYears: 1,
    cellId: null,
    admissionDate: new Date().toISOString().split('T')[0]
  });
  
  const [editPrisoner, setEditPrisoner] = useState<Prisoner | null>(null);
  const [prisonerToAssign, setPrisonerToAssign] = useState<number | null>(null);
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);

  const resetFormData = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: 18,
      crime: '',
      sentenceYears: 1,
      cellId: null,
      admissionDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && editPrisoner) {
      setEditPrisoner({ ...editPrisoner, [name]: name === 'age' || name === 'sentenceYears' ? parseInt(value) : value });
    } else {
      setFormData({ ...formData, [name]: name === 'age' || name === 'sentenceYears' ? parseInt(value) : value });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPrisoner(formData);
    setIsAddDialogOpen(false);
    resetFormData();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrisoner) {
      updatePrisoner(editPrisoner);
      setIsEditDialogOpen(false);
      setEditPrisoner(null);
    }
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prisonerToAssign !== null && selectedCellId !== null) {
      assignPrisonerToCell(prisonerToAssign, selectedCellId);
      setIsAssignDialogOpen(false);
      setPrisonerToAssign(null);
      setSelectedCellId(null);
    }
  };

  const handleEditClick = (prisoner: Prisoner) => {
    setEditPrisoner({ ...prisoner });
    setIsEditDialogOpen(true);
  };

  const handleAssignClick = (prisonerId: number) => {
    setPrisonerToAssign(prisonerId);
    setIsAssignDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      deletePrisoner(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const getCellNumber = (cellId: number | null) => {
    if (!cellId) return "Not Assigned";
    const cell = cells.find(c => c.id === cellId);
    return cell ? cell.cellNumber : "Unknown Cell";
  };

  return (
    <Layout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Prisoner Management</span>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-prison-blue hover:bg-prison-blue/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Prisoner
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Crime</TableHead>
                  <TableHead>Sentence</TableHead>
                  <TableHead>Cell</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prisoners.length > 0 ? (
                  prisoners.map((prisoner) => (
                    <TableRow key={prisoner.id}>
                      <TableCell>{prisoner.id}</TableCell>
                      <TableCell>{`${prisoner.firstName} ${prisoner.lastName}`}</TableCell>
                      <TableCell>{prisoner.age}</TableCell>
                      <TableCell>{prisoner.crime}</TableCell>
                      <TableCell>{prisoner.sentenceYears} years</TableCell>
                      <TableCell>{getCellNumber(prisoner.cellId)}</TableCell>
                      <TableCell>{prisoner.admissionDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditClick(prisoner)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleAssignClick(prisoner.id)}
                            className="h-8 w-8"
                          >
                            <Prison className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDeleteClick(prisoner.id)}
                            className="h-8 w-8 text-prison-red hover:text-prison-red hover:border-prison-red"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No prisoners found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Prisoner Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Prisoner</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="18"
                    max="90"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="crime">Crime</Label>
                  <Input
                    id="crime"
                    name="crime"
                    value={formData.crime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="sentenceYears">Sentence (years)</Label>
                  <Input
                    id="sentenceYears"
                    name="sentenceYears"
                    type="number"
                    min="1"
                    value={formData.sentenceYears}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="admissionDate">Admission Date</Label>
                  <Input
                    id="admissionDate"
                    name="admissionDate"
                    type="date"
                    value={formData.admissionDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-prison-blue hover:bg-prison-blue/90">Add Prisoner</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Prisoner Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prisoner</DialogTitle>
          </DialogHeader>
          {editPrisoner && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={editPrisoner.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={editPrisoner.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min="18"
                      max="90"
                      value={editPrisoner.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="crime">Crime</Label>
                    <Input
                      id="crime"
                      name="crime"
                      value={editPrisoner.crime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="sentenceYears">Sentence (years)</Label>
                    <Input
                      id="sentenceYears"
                      name="sentenceYears"
                      type="number"
                      min="1"
                      value={editPrisoner.sentenceYears}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="admissionDate">Admission Date</Label>
                    <Input
                      id="admissionDate"
                      name="admissionDate"
                      type="date"
                      value={editPrisoner.admissionDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-prison-blue hover:bg-prison-blue/90">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Cell Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Cell</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit}>
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cellId">Select Cell</Label>
                <select
                  id="cellId"
                  name="cellId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedCellId || ''}
                  onChange={(e) => setSelectedCellId(parseInt(e.target.value))}
                  required
                >
                  <option value="">Select a cell</option>
                  {cells
                    .filter(cell => cell.occupants < cell.capacity)
                    .map(cell => (
                      <option key={cell.id} value={cell.id}>
                        {cell.cellNumber} (Block {cell.block}, {cell.capacity - cell.occupants} spaces available)
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-prison-blue hover:bg-prison-blue/90"
                disabled={selectedCellId === null}
              >
                Assign Cell
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this prisoner? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Prisoners;
