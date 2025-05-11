
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Users, Grid, UserSquare2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center">
        <div className="max-w-4xl w-full text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-prison-blue">Prison Management System</h1>
          <p className="text-lg text-prison-gray mb-8">
            A comprehensive solution for prison administration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
          <Card>
            <CardHeader className="text-center bg-prison-light-gray rounded-t-lg">
              <CardTitle className="flex justify-center">
                <Users className="h-8 w-8 text-prison-blue mb-2" />
              </CardTitle>
              <CardTitle>Prisoners</CardTitle>
              <CardDescription>Handle prisoner records efficiently</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-center">
              <p className="mb-4 text-sm">
                Add, edit, and delete prisoner records. Track sentences, cell assignments, and more.
              </p>
              <Button asChild className="bg-prison-blue hover:bg-prison-blue/90">
                <Link to="/prisoners">Manage Prisoners</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center bg-prison-light-gray rounded-t-lg">
              <CardTitle className="flex justify-center">
                <Grid className="h-8 w-8 text-prison-blue mb-2" />
              </CardTitle>
              <CardTitle>Cells</CardTitle>
              <CardDescription>Organize prisoner housing</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-center">
              <p className="mb-4 text-sm">
                View cell availability, assign prisoners to cells, and manage cell blocks.
              </p>
              <Button asChild className="bg-prison-blue hover:bg-prison-blue/90">
                <Link to="/cells">Manage Cells</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center bg-prison-light-gray rounded-t-lg">
              <CardTitle className="flex justify-center">
                <UserSquare2 className="h-8 w-8 text-prison-blue mb-2" />
              </CardTitle>
              <CardTitle>Staff</CardTitle>
              <CardDescription>Oversee prison personnel</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-center">
              <p className="mb-4 text-sm">
                Maintain records of guards, medical staff, and administrative personnel.
              </p>
              <Button asChild className="bg-prison-blue hover:bg-prison-blue/90">
                <Link to="/staff">Manage Staff</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-prison-light-gray p-6 rounded-lg max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-4 text-prison-blue">About</h2>
          <p className="mb-4">
            This Prison Management System is designed as a database-driven application for correctional facilities. 
            It uses Java with a SQL database backend.
          </p>
          <p>
            This interface demonstrates how the system would function with a Java backend implementation.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
