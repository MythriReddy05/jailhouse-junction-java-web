
import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { usePrison, Staff } from '../context/PrisonContext';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StaffPage = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = usePrison();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<Staff, 'id'>>({
    firstName: '',
    lastName: '',
    position: '',
    shift: 'Morning',
    contactNumber: '',
    emailAddress: ''
  });
  
  const [editStaff, setEditStaff] = useState<Staff | null>(null);

  const positions = ["Guard", "Warden", "Medical Officer", "Counselor", "Administrator"];
  const shifts = ["Morning", "Day", "Evening", "Night"];

  const resetFormData = () => {
    setFormData({
      firstName: '',
      lastName: '',
      position: '',
      shift: 'Morning',
      contactNumber: '',
      emailAddress: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && editStaff) {
      setEditStaff({ ...editStaff, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff(formData);
    setIsAddDialogOpen(false);
    resetFormData();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editStaff) {
      updateStaff(editStaff);
      setIsEditDialogOpen(false);
      setEditStaff(null);
    }
  };

  const handleEditClick = (staffMember: Staff) => {
    setEditStaff({ ...staffMember });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      deleteStaff(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "Morning":
        return "bg-blue-500 text-white";
      case "Day":
        return "bg-yellow-500 text-white";
      case "Evening":
        return "bg-orange-500 text-white";
      case "Night":
        return "bg-indigo-900 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "Guard":
        return "bg-slate-600 text-white";
      case "Warden":
        return "bg-prison-blue text-white";
      case "Medical Officer":
        return "bg-green-600 text-white";
      case "Counselor":
        return "bg-purple-600 text-white";
      case "Administrator":
        return "bg-amber-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Layout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Staff Management</span>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-prison-blue hover:bg-prison-blue/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Staff
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
                  <TableHead>Position</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.length > 0 ? (
                  staff.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell>{staffMember.id}</TableCell>
                      <TableCell>{`${staffMember.firstName} ${staffMember.lastName}`}</TableCell>
                      <TableCell>
                        <Badge className={getPositionColor(staffMember.position)}>
                          {staffMember.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getShiftColor(staffMember.shift)}>
                          {staffMember.shift}
                        </Badge>
                      </TableCell>
                      <TableCell>{staffMember.contactNumber}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{staffMember.emailAddress}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditClick(staffMember)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDeleteClick(staffMember.id)}
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
                    <TableCell colSpan={7} className="text-center">No staff members found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">By Position</h3>
              <div className="space-y-3">
                {positions.map(position => {
                  const count = staff.filter(s => s.position === position).length;
                  const percentage = staff.length > 0 ? (count / staff.length) * 100 : 0;
                  
                  return (
                    <div key={position} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{position}</span>
                        <span>{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={getPositionColor(position)}
                          style={{ width: `${percentage}%` }}
                          title={`${percentage.toFixed(1)}%`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">By Shift</h3>
              <div className="space-y-3">
                {shifts.map(shift => {
                  const count = staff.filter(s => s.shift === shift).length;
                  const percentage = staff.length > 0 ? (count / staff.length) * 100 : 0;
                  
                  return (
                    <div key={shift} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{shift}</span>
                        <span>{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={getShiftColor(shift)}
                          style={{ width: `${percentage}%` }}
                          title={`${percentage.toFixed(1)}%`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
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
                  <Label htmlFor="position">Position</Label>
                  <select
                    id="position"
                    name="position"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="shift">Shift</Label>
                  <select
                    id="shift"
                    name="shift"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.shift}
                    onChange={handleInputChange}
                    required
                  >
                    {shifts.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    value={formData.emailAddress}
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
              <Button type="submit" className="bg-prison-blue hover:bg-prison-blue/90">Add Staff</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {editStaff && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={editStaff.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={editStaff.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="position">Position</Label>
                    <select
                      id="position"
                      name="position"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={editStaff.position}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select position</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="shift">Shift</Label>
                    <select
                      id="shift"
                      name="shift"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={editStaff.shift}
                      onChange={handleInputChange}
                      required
                    >
                      {shifts.map(shift => (
                        <option key={shift} value={shift}>{shift}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={editStaff.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      value={editStaff.emailAddress}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this staff member? This action cannot be undone.</p>
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

export default StaffPage;
