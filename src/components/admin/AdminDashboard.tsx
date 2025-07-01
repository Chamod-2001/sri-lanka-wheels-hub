
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Users, Settings, CheckSquare, XSquare, Clock, TrendingUp, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activities, setActivities] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRequests(JSON.parse(localStorage.getItem('modification_requests') || '[]'));
    setVehicles(JSON.parse(localStorage.getItem('vehicles') || '[]'));
    setActivities(JSON.parse(localStorage.getItem('user_activities') || '[]'));
  };

  const handleRequest = (requestId: string, action: 'approve' | 'reject') => {
    const updatedRequests = requests.map((req: any) => {
      if (req.id === requestId) {
        return { ...req, status: action === 'approve' ? 'approved' : 'rejected' };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    localStorage.setItem('modification_requests', JSON.stringify(updatedRequests));
    
    toast({
      title: `Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The modification request has been ${action === 'approve' ? 'approved' : 'rejected'}`,
    });
  };

  const calculateProfits = () => {
    const soldVehicles = vehicles.filter((v: any) => v.status === 'sold');
    const totalRevenue = soldVehicles.reduce((sum: number, v: any) => sum + parseInt(v.price || '0'), 0);
    return totalRevenue;
  };

  const getRecentActivities = () => {
    return activities
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <div className="text-2xl font-bold text-black">{vehicles.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <div className="text-2xl font-bold text-green-600">
                  {vehicles.filter((v: any) => v.status === 'available').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <div className="text-2xl font-bold text-blue-600">
                  LKR {calculateProfits().toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-300 bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <div className="text-2xl font-bold text-orange-600">
                  {requests.filter((r: any) => r.status === 'pending').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-yellow-100">
          <TabsTrigger value="requests" className="data-[state=active]:bg-yellow-400">
            Modification Requests
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-yellow-400">
            User Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card className="border-yellow-300">
            <CardHeader>
              <CardTitle className="text-black">Pending Modification Requests</CardTitle>
              <CardDescription>Review and approve/reject employee requests</CardDescription>
            </CardHeader>
            <CardContent>
              {requests.filter((r: any) => r.status === 'pending').length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {requests
                    .filter((r: any) => r.status === 'pending')
                    .map((request: any) => (
                      <Card key={request.id} className="border-orange-200 bg-orange-50">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-orange-100">
                                  {request.action.toUpperCase()}
                                </Badge>
                                <span className="font-semibold">
                                  {request.vehicleDetails?.vehicleNumber}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                <strong>Vehicle:</strong> {request.vehicleDetails?.brand} {request.vehicleDetails?.model}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Requested by:</strong> {request.requestedBy}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Date:</strong> {new Date(request.requestDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Reason:</strong> {request.reason}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleRequest(request.id, 'approve')}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckSquare className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequest(request.id, 'reject')}
                                className="border-red-300 hover:bg-red-50"
                              >
                                <XSquare className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card className="border-yellow-300">
            <CardHeader>
              <CardTitle className="text-black">Recent User Activities</CardTitle>
              <CardDescription>Track employee actions and system usage</CardDescription>
            </CardHeader>
            <CardContent>
              {getRecentActivities().length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activities</p>
              ) : (
                <div className="space-y-3">
                  {getRecentActivities().map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-black">{activity.details}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100">
                        {activity.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
