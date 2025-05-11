
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-prison-blue text-white py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} PrisonMS</p>
          <p className="text-sm mt-2 md:mt-0">DBMS Project - Java, Spring Boot & SQL</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
