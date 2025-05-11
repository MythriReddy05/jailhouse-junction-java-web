
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Users, Grid, UserSquare2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-prison-blue text-white' : 'hover:bg-prison-light-gray';
  };
  
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Building2 className="h-8 w-8 text-prison-blue mr-2" />
            <h1 className="text-2xl font-bold text-prison-blue">Prison Management System</h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Link 
              to="/" 
              className={`${isActive('/')} flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link 
              to="/prisoners" 
              className={`${isActive('/prisoners')} flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <Users className="h-4 w-4 mr-2" />
              Prisoner Management
            </Link>
            <Link 
              to="/cells" 
              className={`${isActive('/cells')} flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <Grid className="h-4 w-4 mr-2" />
              Cell Management
            </Link>
            <Link 
              to="/staff" 
              className={`${isActive('/staff')} flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <UserSquare2 className="h-4 w-4 mr-2" />
              Staff Management
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
