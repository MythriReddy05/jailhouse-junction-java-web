
import React, { useState } from 'react';
import { usePrison } from '../context/PrisonContext';
import Layout from '../components/layout/Layout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const Cells = () => {
  const { cells, prisoners } = usePrison();
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
  const [showOccupantsDialog, setShowOccupantsDialog] = useState(false);
  
  const handleViewOccupants = (cellId: number) => {
    setSelectedCellId(cellId);
    setShowOccupantsDialog(true);
  };
  
  // Get prisoners in a specific cell
  const getCellOccupants = (cellId: number) => {
    return prisoners.filter(prisoner => prisoner.cellId === cellId);
  };
  
  // Get cell availability status and color
  const getCellStatus = (cell: { capacity: number; occupants: number }) => {
    const availableSpace = cell.capacity - cell.occupants;
    if (availableSpace === 0) {
      return { text: "Full", color: "bg-prison-red text-white" };
    } else if (availableSpace === cell.capacity) {
      return { text: "Empty", color: "bg-green-500 text-white" };
    } else {
      return { text: `${availableSpace} Available`, color: "bg-yellow-500 text-white" };
    }
  };

  const getOccupancyPercentage = (cell: { capacity: number; occupants: number }) => {
    return (cell.occupants / cell.capacity) * 100;
  };

  return (
    <Layout>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cell Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cell Number</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cells.map((cell) => {
                  const status = getCellStatus(cell);
                  return (
                    <TableRow key={cell.id}>
                      <TableCell className="font-medium">{cell.cellNumber}</TableCell>
                      <TableCell>{cell.block}</TableCell>
                      <TableCell>{cell.capacity}</TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div 
                            className={`h-2.5 rounded-full ${
                              getOccupancyPercentage(cell) === 100 
                                ? 'bg-prison-red' 
                                : getOccupancyPercentage(cell) === 0 
                                  ? 'bg-green-500' 
                                  : 'bg-yellow-500'
                            }`}
                            style={{ width: `${getOccupancyPercentage(cell)}%` }}
                          ></div>
                        </div>
                        {cell.occupants} / {cell.capacity}
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.text}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewOccupants(cell.id)}
                          className="flex items-center"
                          disabled={cell.occupants === 0}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View Occupants
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cell Block Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['A', 'B', 'C'].map(block => {
              const blockCells = cells.filter(cell => cell.block === block);
              const totalCapacity = blockCells.reduce((sum, cell) => sum + cell.capacity, 0);
              const totalOccupants = blockCells.reduce((sum, cell) => sum + cell.occupants, 0);
              const occupancyRate = totalCapacity > 0 ? (totalOccupants / totalCapacity) * 100 : 0;
              
              return (
                <Card key={block}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Block {block}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Cells:</span>
                        <span className="font-medium">{blockCells.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Capacity:</span>
                        <span className="font-medium">{totalCapacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current Occupants:</span>
                        <span className="font-medium">{totalOccupants}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available Space:</span>
                        <span className="font-medium">{totalCapacity - totalOccupants}</span>
                      </div>
                      <div className="pt-2">
                        <div className="text-sm mb-1 flex justify-between">
                          <span>Occupancy Rate:</span>
                          <span className="font-medium">{occupancyRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              occupancyRate >= 90 ? 'bg-prison-red' : 
                              occupancyRate >= 70 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cell Occupants Dialog */}
      <Dialog open={showOccupantsDialog} onOpenChange={setShowOccupantsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Cell Occupants - {selectedCellId && cells.find(c => c.id === selectedCellId)?.cellNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Crime</TableHead>
                  <TableHead>Sentence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCellId && getCellOccupants(selectedCellId).length > 0 ? (
                  getCellOccupants(selectedCellId).map(prisoner => (
                    <TableRow key={prisoner.id}>
                      <TableCell>{prisoner.id}</TableCell>
                      <TableCell>{`${prisoner.firstName} ${prisoner.lastName}`}</TableCell>
                      <TableCell>{prisoner.crime}</TableCell>
                      <TableCell>{prisoner.sentenceYears} years</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">No occupants in this cell</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowOccupantsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Cells;
