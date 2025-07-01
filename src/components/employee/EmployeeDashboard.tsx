
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Activity } from "lucide-react";

const EmployeeDashboard = () => {
  const [employees] = useState([
    { id: '2', name: 'Kasun Silva', email: 'kasun@lankanwheels.lk', role: 'employee', status: 'active', joinDate: '2024-01-15' },
    { id: '3', name: 'Priya Fernando', email: 'priya@lankanwheels.lk', role: 'employee', status: 'active', joinDate: '2024-02-01' },
    { id: '4', name: 'Rajith Perera', email: 'rajith@lankanwheels.lk', role: 'employee', status: 'inactive', joinDate: '2023-12-10' },
  ]);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    setActivities(savedActivities);
  }, []);

  const getEmployeeActivities = (employeeId: string) => {
    return activities
      .filter((activity: any) => activity.userId === employeeId)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <div className="text-2xl font-bold text-black">{employees.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <div className="text-2xl font-bold text-green-600">
                  {employees.filter(emp => emp.status === 'active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-300 bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <div className="text-2xl font-bold text-red-600">
                  {employees.filter(emp => emp.status === 'inactive').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card className="border-yellow-300">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Employee Management
          </CardTitle>
          <CardDescription>View and manage employee details and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {employees.map((employee) => (
              <Card key={employee.id} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{employee.name}</h3>
                      <p className="text-gray-600">{employee.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(employee.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={employee.status === 'active' ? 'default' : 'secondary'}
                      className={employee.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                    >
                      {employee.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-black mb-2 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Recent Activities
                    </h4>
                    <div className="space-y-2">
                      {getEmployeeActivities(employee.id).length === 0 ? (
                        <p className="text-sm text-gray-500">No recent activities</p>
                      ) : (
                        getEmployeeActivities(employee.id).map((activity: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">{activity.details}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.action}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
