
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bike, Car, Camera } from "lucide-react";

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    type: "",
    brand: "",
    model: "",
    color: "",
    registrationYear: "",
    manufacturingYear: "",
    price: "",
    mileage: "",
    description: "",
    photos: [] as File[]
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.vehicleNumber || !formData.type || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const newVehicle = {
      ...formData,
      id: Date.now().toString(),
      addedBy: JSON.parse(localStorage.getItem('lankanwheels_user') || '{}').name,
      addedDate: new Date().toISOString(),
      status: 'available',
      photos: formData.photos.map(file => URL.createObjectURL(file))
    };

    vehicles.push(newVehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));

    // Log activity
    const user = JSON.parse(localStorage.getItem('lankanwheels_user') || '{}');
    const activity = {
      userId: user.id,
      action: 'ADD_VEHICLE',
      timestamp: new Date().toISOString(),
      details: `Added vehicle ${formData.vehicleNumber} - ${formData.brand} ${formData.model}`
    };
    
    const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    activities.push(activity);
    localStorage.setItem('user_activities', JSON.stringify(activities));

    toast({
      title: "Vehicle Added Successfully",
      description: `${formData.brand} ${formData.model} has been added to inventory`,
    });

    // Reset form
    setFormData({
      vehicleNumber: "",
      type: "",
      brand: "",
      model: "",
      color: "",
      registrationYear: "",
      manufacturingYear: "",
      price: "",
      mileage: "",
      description: "",
      photos: []
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  return (
    <Card className="border-yellow-300 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-t-lg">
        <CardTitle className="flex items-center text-black">
          <Car className="h-6 w-6 mr-2" />
          Add New Vehicle
        </CardTitle>
        <CardDescription>
          Enter vehicle details to add to inventory
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
              <Input
                id="vehicleNumber"
                placeholder="e.g., CAB-1234"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                className="border-yellow-300 focus:border-yellow-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="border-yellow-300 focus:border-yellow-500">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="three-wheeler">Three Wheeler</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Honda, Yamaha, Bajaj"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="e.g., CB125, CT100"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="e.g., Red, Blue, Black"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationYear">Registration Year</Label>
              <Input
                id="registrationYear"
                type="number"
                placeholder="e.g., 2020"
                value={formData.registrationYear}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationYear: e.target.value }))}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturingYear">Manufacturing Year</Label>
              <Input
                id="manufacturingYear"
                type="number"
                placeholder="e.g., 2019"
                value={formData.manufacturingYear}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturingYear: e.target.value }))}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (LKR) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 450000"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="border-yellow-300 focus:border-yellow-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="e.g., 25000"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about the vehicle..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border-yellow-300 focus:border-yellow-500"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Vehicle Photos</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="border-yellow-300 focus:border-yellow-500"
              />
              <Camera className="h-5 w-5 text-gray-500" />
            </div>
            {formData.photos.length > 0 && (
              <p className="text-sm text-gray-600">{formData.photos.length} photo(s) selected</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black font-semibold"
          >
            Add Vehicle to Inventory
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
