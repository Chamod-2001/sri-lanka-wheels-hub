
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Wrench, MapPin, Calendar, Plus, Eye } from "lucide-react";

interface RepairRecord {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  repairShop: string;
  location: string;
  dateAdmitted: string;
  expectedCompletion: string;
  status: 'in-progress' | 'completed' | 'delayed';
  description: string;
  cost: string;
  addedBy: string;
}

interface RepairTrackingProps {
  userRole: string | null;
}

const RepairTracking = ({ userRole }: RepairTrackingProps) => {
  const [repairs, setRepairs] = useState<RepairRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: "",
    repairShop: "",
    location: "",
    dateAdmitted: "",
    expectedCompletion: "",
    description: "",
    cost: ""
  });

  const { toast } = useToast();

  const repairShops = [
    { name: "AutoCare Colombo", location: "Colombo 03" },
    { name: "Quick Fix Kandy", location: "Kandy" },
    { name: "Moto Service Galle", location: "Galle" },
    { name: "Three Wheeler Experts", location: "Negombo" },
    { name: "Bike Doctor Matara", location: "Matara" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedRepairs = JSON.parse(localStorage.getItem('repairs') || '[]');
    const savedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    setRepairs(savedRepairs);
    setVehicles(savedVehicles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.repairShop || !formData.dateAdmitted) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedVehicle = vehicles.find((v: any) => v.id === formData.vehicleId);
    const user = JSON.parse(localStorage.getItem('lankanwheels_user') || '{}');
    
    const newRepair: RepairRecord = {
      id: Date.now().toString(),
      vehicleId: formData.vehicleId,
      vehicleNumber: selectedVehicle?.vehicleNumber || '',
      repairShop: formData.repairShop,
      location: formData.location,
      dateAdmitted: formData.dateAdmitted,
      expectedCompletion: formData.expectedCompletion,
      status: 'in-progress',
      description: formData.description,
      cost: formData.cost,
      addedBy: user.name
    };

    const updatedRepairs = [...repairs, newRepair];
    setRepairs(updatedRepairs);
    localStorage.setItem('repairs', JSON.stringify(updatedRepairs));

    // Update vehicle status
    const updatedVehicles = vehicles.map((v: any) => 
      v.id === formData.vehicleId ? { ...v, status: 'repair' } : v
    );
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

    // Log activity
    const activity = {
      userId: user.id,
      action: 'ADD_REPAIR',
      timestamp: new Date().toISOString(),
      details: `Added repair record for vehicle ${selectedVehicle?.vehicleNumber} at ${formData.repairShop}`
    };
    
    const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    activities.push(activity);
    localStorage.setItem('user_activities', JSON.stringify(activities));

    toast({
      title: "Repair Record Added",
      description: `Vehicle ${selectedVehicle?.vehicleNumber} has been sent to ${formData.repairShop}`,
    });

    // Reset form
    setFormData({
      vehicleId: "",
      repairShop: "",
      location: "",
      dateAdmitted: "",
      expectedCompletion: "",
      description: "",
      cost: ""
    });
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Repair Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-black">{repairs.length}</div>
            <p className="text-sm text-gray-600">Total Repairs</p>
          </CardContent>
        </Card>
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {repairs.filter(r => r.status === 'in-progress').length}
            </div>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {repairs.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {repairs.filter(r => r.status === 'delayed').length}
            </div>
            <p className="text-sm text-gray-600">Delayed</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Repair Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Repair Tracking</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Repair Record
        </Button>
      </div>

      {/* Add Repair Form */}
      {showAddForm && (
        <Card className="border-yellow-300">
          <CardHeader>
            <CardTitle className="text-black">Add New Repair Record</CardTitle>
            <CardDescription>Send a vehicle to repair shop</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Select Vehicle *</Label>
                  <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}>
                    <SelectTrigger className="border-yellow-300">
                      <SelectValue placeholder="Choose vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles
                        .filter((v: any) => v.status === 'available')
                        .map((vehicle: any) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.vehicleNumber} - {vehicle.brand} {vehicle.model}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repairShop">Repair Shop *</Label>
                  <Select 
                    value={formData.repairShop} 
                    onValueChange={(value) => {
                      const shop = repairShops.find(s => s.name === value);
                      setFormData(prev => ({ 
                        ...prev, 
                        repairShop: value,
                        location: shop?.location || ''
                      }));
                    }}
                  >
                    <SelectTrigger className="border-yellow-300">
                      <SelectValue placeholder="Choose repair shop" />
                    </SelectTrigger>
                    <SelectContent>
                      {repairShops.map((shop) => (
                        <SelectItem key={shop.name} value={shop.name}>
                          {shop.name} - {shop.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateAdmitted">Date Admitted *</Label>
                  <Input
                    id="dateAdmitted"
                    type="date"
                    value={formData.dateAdmitted}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateAdmitted: e.target.value }))}
                    className="border-yellow-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedCompletion">Expected Completion</Label>
                  <Input
                    id="expectedCompletion"
                    type="date"
                    value={formData.expectedCompletion}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedCompletion: e.target.value }))}
                    className="border-yellow-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Estimated Cost (LKR)</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="e.g., 25000"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    className="border-yellow-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Repair Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the repair work needed..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="border-yellow-300"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black"
                >
                  Add Repair Record
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Repair Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {repairs.map((repair) => (
          <Card key={repair.id} className="border-yellow-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-black flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    {repair.vehicleNumber}
                  </CardTitle>
                  <CardDescription>{repair.repairShop}</CardDescription>
                </div>
                <Badge className={getStatusColor(repair.status)}>
                  {repair.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{repair.location}</span>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>Admitted: {new Date(repair.dateAdmitted).toLocaleDateString()}</span>
              </div>

              {repair.expectedCompletion && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Expected: {new Date(repair.expectedCompletion).toLocaleDateString()}</span>
                </div>
              )}

              {repair.description && (
                <div className="text-sm">
                  <strong>Description:</strong> {repair.description}
                </div>
              )}

              {repair.cost && (
                <div className="text-sm">
                  <strong>Cost:</strong> LKR {parseInt(repair.cost).toLocaleString()}
                </div>
              )}

              <div className="text-sm text-gray-600">
                <strong>Added by:</strong> {repair.addedBy}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {repairs.length === 0 && (
        <Card className="border-yellow-300">
          <CardContent className="py-12 text-center">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No repair records found</p>
            <p className="text-sm text-gray-400">Add a repair record to track vehicle maintenance</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RepairTracking;
