
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

// Define types
export interface Prisoner {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  crime: string;
  sentenceYears: number;
  cellId: number | null;
  admissionDate: string;
}

export interface Cell {
  id: number;
  cellNumber: string;
  capacity: number;
  block: string;
  occupants: number;
}

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  shift: string;
  contactNumber: string;
  emailAddress: string;
}

// Initial data
const initialPrisoners: Prisoner[] = [
  { id: 1, firstName: "John", lastName: "Doe", age: 35, crime: "Theft", sentenceYears: 3, cellId: 1, admissionDate: "2023-05-15" },
  { id: 2, firstName: "Michael", lastName: "Smith", age: 42, crime: "Fraud", sentenceYears: 5, cellId: 1, admissionDate: "2022-11-08" },
  { id: 3, firstName: "Robert", lastName: "Johnson", age: 29, crime: "Assault", sentenceYears: 7, cellId: 2, admissionDate: "2021-03-21" },
  { id: 4, firstName: "William", lastName: "Brown", age: 38, crime: "Drug Possession", sentenceYears: 2, cellId: 3, admissionDate: "2024-01-14" },
  { id: 5, firstName: "David", lastName: "Miller", age: 45, crime: "Robbery", sentenceYears: 10, cellId: 4, admissionDate: "2020-08-30" }
];

const initialCells: Cell[] = [
  { id: 1, cellNumber: "A-101", capacity: 2, block: "A", occupants: 2 },
  { id: 2, cellNumber: "A-102", capacity: 1, block: "A", occupants: 1 },
  { id: 3, cellNumber: "B-201", capacity: 2, block: "B", occupants: 1 },
  { id: 4, cellNumber: "B-202", capacity: 2, block: "B", occupants: 1 },
  { id: 5, cellNumber: "C-301", capacity: 4, block: "C", occupants: 0 }
];

const initialStaff: Staff[] = [
  { id: 1, firstName: "James", lastName: "Wilson", position: "Guard", shift: "Morning", contactNumber: "555-1234", emailAddress: "james.wilson@prison.gov" },
  { id: 2, firstName: "Patricia", lastName: "Moore", position: "Warden", shift: "Day", contactNumber: "555-5678", emailAddress: "patricia.moore@prison.gov" },
  { id: 3, firstName: "Richard", lastName: "Taylor", position: "Medical Officer", shift: "Evening", contactNumber: "555-9012", emailAddress: "richard.taylor@prison.gov" },
  { id: 4, firstName: "Jennifer", lastName: "Anderson", position: "Counselor", shift: "Day", contactNumber: "555-3456", emailAddress: "jennifer.anderson@prison.gov" },
  { id: 5, firstName: "Charles", lastName: "Thomas", position: "Guard", shift: "Night", contactNumber: "555-7890", emailAddress: "charles.thomas@prison.gov" }
];

// Context type
interface PrisonContextType {
  prisoners: Prisoner[];
  cells: Cell[];
  staff: Staff[];
  addPrisoner: (prisoner: Omit<Prisoner, 'id'>) => void;
  updatePrisoner: (prisoner: Prisoner) => void;
  deletePrisoner: (id: number) => void;
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: number) => void;
  assignPrisonerToCell: (prisonerId: number, cellId: number) => void;
  getPrisonerById: (id: number) => Prisoner | undefined;
  getStaffById: (id: number) => Staff | undefined;
  getCellById: (id: number) => Cell | undefined;
}

// Create context
export const PrisonContext = createContext<PrisonContextType | undefined>(undefined);

// Provider component
export const PrisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prisoners, setPrisoners] = useState<Prisoner[]>(initialPrisoners);
  const [cells, setCells] = useState<Cell[]>(initialCells);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);

  // Prisoner functions
  const addPrisoner = (prisoner: Omit<Prisoner, 'id'>) => {
    const newId = Math.max(0, ...prisoners.map(p => p.id)) + 1;
    setPrisoners([...prisoners, { id: newId, ...prisoner }]);
    toast.success("Prisoner added successfully");
  };

  const updatePrisoner = (updatedPrisoner: Prisoner) => {
    setPrisoners(prisoners.map(p => p.id === updatedPrisoner.id ? updatedPrisoner : p));
    toast.success("Prisoner updated successfully");
  };

  const deletePrisoner = (id: number) => {
    setPrisoners(prisoners.filter(p => p.id !== id));
    toast.success("Prisoner deleted successfully");
  };

  // Staff functions
  const addStaff = (staffMember: Omit<Staff, 'id'>) => {
    const newId = Math.max(0, ...staff.map(s => s.id)) + 1;
    setStaff([...staff, { id: newId, ...staffMember }]);
    toast.success("Staff member added successfully");
  };

  const updateStaff = (updatedStaff: Staff) => {
    setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    toast.success("Staff member updated successfully");
  };

  const deleteStaff = (id: number) => {
    setStaff(staff.filter(s => s.id !== id));
    toast.success("Staff member deleted successfully");
  };

  // Cell functions
  const assignPrisonerToCell = (prisonerId: number, cellId: number) => {
    // Update prisoner's cell assignment
    setPrisoners(prisoners.map(p => {
      if (p.id === prisonerId) {
        const oldCellId = p.cellId;
        
        // If prisoner is being moved from another cell, decrement that cell's occupants
        if (oldCellId) {
          setCells(cells.map(c => 
            c.id === oldCellId ? { ...c, occupants: Math.max(0, c.occupants - 1) } : c
          ));
        }
        
        return { ...p, cellId };
      }
      return p;
    }));
    
    // Update cell's occupant count
    setCells(cells.map(c => {
      if (c.id === cellId) {
        return { ...c, occupants: c.occupants + 1 };
      }
      return c;
    }));
    
    toast.success("Prisoner assigned to cell successfully");
  };

  // Helper functions to get items by ID
  const getPrisonerById = (id: number) => prisoners.find(p => p.id === id);
  const getStaffById = (id: number) => staff.find(s => s.id === id);
  const getCellById = (id: number) => cells.find(c => c.id === id);

  const value = {
    prisoners,
    cells,
    staff,
    addPrisoner,
    updatePrisoner,
    deletePrisoner,
    addStaff,
    updateStaff,
    deleteStaff,
    assignPrisonerToCell,
    getPrisonerById,
    getStaffById,
    getCellById
  };

  return <PrisonContext.Provider value={value}>{children}</PrisonContext.Provider>;
};

// Custom hook to use the context
export const usePrison = () => {
  const context = useContext(PrisonContext);
  if (context === undefined) {
    throw new Error('usePrison must be used within a PrisonProvider');
  }
  return context;
};
