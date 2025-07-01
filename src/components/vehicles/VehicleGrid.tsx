
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, Eye, Bike, Car } from "lucide-react";

interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: string;
  brand: string;
  model: string;
  color: string;
  registrationYear: string;
  manufacturingYear: string;
  price: string;
  mileage: string;
  description: string;
  photos: string[];
  addedBy: string;
  addedDate: string;
  status: string;
}

interface VehicleGridProps {
  userRole: string | null;
}

const VehicleGrid = ({ userRole }: VehicleGridProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [searchTerm, typeFilter, vehicles]);

  const loadVehicles = () => {
    const savedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    setVehicles(savedVehicles);
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(vehicle => vehicle.type === typeFilter);
    }

    setFilteredVehicles(filtered);
  };

  const requestModification = (vehicleId: string, action: 'update' | 'delete') => {
    const user = JSON.parse(localStorage.getItem('lankanwheels_user') || '{}');
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    const request = {
      id: Date.now().toString(),
      vehicleId,
      vehicleDetails: vehicle,
      requestedBy: user.name,
      requestedById: user.id,
      action,
      status: 'pending',
      requestDate: new Date().toISOString(),
      reason: `Request to ${action} vehicle ${vehicle?.vehicleNumber}`
    };

    const requests = JSON.parse(localStorage.getItem('modification_requests') || '[]');
    requests.push(request);
    localStorage.setItem('modification_requests', JSON.stringify(requests));

    // Log activity
    const activity = {
      userId: user.id,
      action: `REQUEST_${action.toUpperCase()}`,
      timestamp: new Date().toISOString(),
      details: `Requested to ${action} vehicle ${vehicle?.vehicleNumber}`
    };
    
    const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    activities.push(activity);
    localStorage.setItem('user_activities', JSON.stringify(activities));

    toast({
      title: "Request Submitted",
      description: `Your request to ${action} the vehicle has been sent to admin for approval`,
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(parseInt(price));
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'motorcycle':
      case 'scooter':
        return <Bike className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-yellow-300">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search & Filter Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by vehicle number, brand, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="md:w-48 border-yellow-300 focus:border-yellow-500">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="scooter">Scooter</SelectItem>
                <SelectItem value="three-wheeler">Three Wheeler</SelectItem>
                <SelectItem value="car">Car</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-black">{vehicles.length}</div>
            <p className="text-sm text-gray-600">Total Vehicles</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-300 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter(v => v.status === 'available').length}
            </div>
            <p className="text-sm text-gray-600">Available</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-300 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {vehicles.filter(v => v.status === 'sold').length}
            </div>
            <p className="text-sm text-gray-600">Sold</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-300 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {vehicles.filter(v => v.status === 'repair').length}
            </div>
            <p className="text-sm text-gray-600">In Repair</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="border-yellow-300 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {getVehicleIcon(vehicle.type)}
                  <CardTitle className="text-lg text-black">{vehicle.vehicleNumber}</CardTitle>
                </div>
                <Badge 
                  variant={vehicle.status === 'available' ? 'default' : 'secondary'}
                  className={vehicle.status === 'available' ? 'bg-green-500' : ''}
                >
                  {vehicle.status}
                </Badge>
              </div>
              <CardDescription>
                {vehicle.brand} {vehicle.model} • {vehicle.color}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-yellow-600">
                {formatPrice(vehicle.price)}
              </div>
              
              <div className="text-sm space-y-1">
                <p><strong>Type:</strong> {vehicle.type}</p>
                <p><strong>Year:</strong> {vehicle.registrationYear}</p>
                {vehicle.mileage && <p><strong>Mileage:</strong> {parseInt(vehicle.mileage).toLocaleString()} km</p>}
                <p><strong>Added by:</strong> {vehicle.addedBy}</p>
              </div>

              <div className="flex justify-between pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="border-yellow-300 hover:bg-yellow-50"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>

                {userRole === 'employee' && (
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestModification(vehicle.id, 'update')}
                      className="border-blue-300 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Request Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestModification(vehicle.id, 'delete')}
                      className="border-red-300 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Request Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="border-yellow-300">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No vehicles found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleGrid;
