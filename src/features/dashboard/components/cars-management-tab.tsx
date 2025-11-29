"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import useCreateCar from "@/hooks/use-create-car";
import useUpdateCar from "@/hooks/use-update-car";
import useDeleteCar from "@/hooks/use-delete-car";
import type { Car } from "@/types";

type CarFormData = {
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  description: string;
  imageUrl: string;
};

const CarsManagementTab = () => {
  const { data: cars, isLoading } = useQuery({
    queryKey: QUERY_KEYS.cars,
    queryFn: async () => {
      const res = await betterFetch("@get/Car");
      if (res.error) throw res.error;
      return res.data;
    },
  });
  const createCar = useCreateCar();
  const updateCar = useUpdateCar();
  const deleteCar = useDeleteCar();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<{ id: number; data: CarFormData } | null>(null);
  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: 0,
    description: "",
    imageUrl: "",
  });

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      pricePerDay: 0,
      description: "",
      imageUrl: "",
    });
    setEditingCar(null);
  };

  const handleCreate = async () => {
    await createCar.mutateAsync({
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      pricePerDay: formData.pricePerDay,
      description: formData.description || null,
      imageUrl: formData.imageUrl || null,
    });
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingCar) return;
    await updateCar.mutateAsync({
      id: editingCar.id,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      pricePerDay: formData.pricePerDay,
      description: formData.description || null,
      imageUrl: formData.imageUrl || null,
    });
    resetForm();
  };

  const handleEdit = (car: Car) => {
    const carFormData: CarFormData = {
      brand: car.brand,
      model: car.model,
      year: car.year,
      pricePerDay: car.pricePerDay,
      description: car.description || "",
      imageUrl: car.imageUrl || "",
    };
    setEditingCar({ id: car.id, data: carFormData });
    setFormData(carFormData);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this car?")) {
      await deleteCar.mutateAsync(id);
    }
  };

  const isFormValid = Boolean(formData.brand && formData.model && formData.year > 0 && formData.pricePerDay > 0);

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cars Management</CardTitle>
              <CardDescription>Add, update, or remove cars from the system</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>Add New Car</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Car</DialogTitle>
                  <DialogDescription>Fill in the details to add a new car to the system</DialogDescription>
                </DialogHeader>
                <CarForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleCreate}
                  isSubmitting={createCar.isPending}
                  isValid={isFormValid}
                  submitLabel="Create Car"
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {editingCar && (
        <Dialog open={!!editingCar} onOpenChange={(open) => !open && resetForm()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Car</DialogTitle>
              <DialogDescription>Update the car details</DialogDescription>
            </DialogHeader>
            <CarForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdate}
              isSubmitting={updateCar.isPending}
              isValid={isFormValid}
              submitLabel="Update Car"
            />
          </DialogContent>
        </Dialog>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Cars</CardTitle>
          <CardDescription>List of all cars in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : cars && cars.length > 0 ? (
            <Table>
              <TableCaption>A list of all cars.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>{car.id}</TableCell>
                    <TableCell>{car.brand}</TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>${car.pricePerDay.toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate">{car.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(car)}
                          disabled={updateCar.isPending || deleteCar.isPending}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(car.id)}
                          disabled={updateCar.isPending || deleteCar.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No cars found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

type CarFormProps = {
  formData: CarFormData;
  setFormData: (data: CarFormData) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  submitLabel: string;
};

const CarForm = ({ formData, setFormData, onSubmit, isSubmitting, isValid, submitLabel }: CarFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand" className="mb-1">Brand *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Toyota"
            required
          />
        </div>
        <div>
          <Label htmlFor="model" className="mb-1">Model *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Camry"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year" className="mb-1">Year *</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            min={1900}
            max={2100}
            required
          />
        </div>
        <div>
          <Label htmlFor="pricePerDay" className="mb-1">Price Per Day ($) *</Label>
          <Input
            id="pricePerDay"
            type="number"
            step="0.01"
            value={formData.pricePerDay}
            onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
            min={0}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description" className="mb-1">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Car description..."
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="imageUrl" className="mb-1">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default CarsManagementTab;

