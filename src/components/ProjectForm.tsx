
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Save, X, Upload } from "lucide-react";
import axios from "axios";

interface ProjectFormData {
  title: string;
  address: string;
  description: string;
  year: number;
  link: string;
  images: File[];
}

const ProjectForm = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    address: "",
    description: "",
    year: new Date().getFullYear(),
    link: "",
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const fetchAddressSuggestions = async (query: string) => {
  setIsAddressLoading(true);
  try {
    const response = await axios.get("https://best-yard.onrender.com/api/suggest", {
      params: { query, type: "geo" },
    });

    if (response.status === 200) {
      setAddressSuggestions(response.data.suggestions);
    } else {
      setAddressSuggestions([]);
    }
  } catch (error) {
    console.error("Ошибка при получении подсказок адреса:", error);
    setAddressSuggestions([]);
  } finally {
    setIsAddressLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  if (name === "address" && value.length > 2) {
    fetchAddressSuggestions(value);
  } else if (name === "address") {
    setAddressSuggestions([]);
  }
};

  const handleSelectAddress = (suggestion: string) => {
  setFormData((prev) => ({ ...prev, address: suggestion }));
  setAddressSuggestions([]);
};

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      // Convert FileList to Array
      const newFiles = Array.from(files);
      
      // Update form data with new files
      setFormData((prev) => ({ 
        ...prev, 
        images: [...prev.images, ...newFiles]
      }));
      
      // Create preview URLs for new files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remove image from form data
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    // Remove preview URL
    const updatedPreviews = [...previewUrls];
    const removedPreviewUrl = updatedPreviews[index];
    updatedPreviews.splice(index, 1);
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(removedPreviewUrl);
    
    // Update state
    setFormData(prev => ({ ...prev, images: updatedImages }));
    setPreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.images.length === 0) {
    toast.error("Пожалуйста, загрузите хотя бы одну фотографию проекта");
    return;
  }

  setIsSubmitting(true);

  try {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("address", formData.address);
    data.append("description", formData.description);
    data.append("year", formData.year.toString());
    data.append("link", formData.link);

    formData.images.forEach((image) => {
      data.append("images", image); // 👈 имя должно быть "images" — как на сервере
    });

    const response = await axios.post("https://best-yard.onrender.com/api/projects/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      toast.success("Проект успешно добавлен!");

      // Очистка формы
      setFormData({
        title: "",
        address: "",
        description: "",
        year: new Date().getFullYear(),
        link: "",
        images: [],
      });

      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } else {
      toast.error("Ошибка при добавлении проекта. Попробуйте ещё раз.");
    }
  } catch (error) {
    console.error("Ошибка при добавлении проекта:", error);
    toast.error("Ошибка при добавлении проекта. Попробуйте ещё раз.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus size={20} /> Добавление нового проекта
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Название проекта
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Например: ЖК «Южный»"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="relative">
  <label htmlFor="address" className="block text-sm font-medium mb-1">
    Адрес
  </label>
  <Input
    id="address"
    name="address"
    placeholder="Например: ул. Дружбы, 28/4"
    value={formData.address}
    onChange={handleInputChange}
    required
    autoComplete="off"
  />
  {addressSuggestions.length > 0 && (
    <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-md w-full">
      {addressSuggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => handleSelectAddress(suggestion)}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
</div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium mb-1">
                  Ссылка на сайт (если есть)
                </label>
                <Input
                  id="link"
                  name="link"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-1">
                  Год реализации
                </label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="2020"
                  max="2030"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Описание проекта
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Опишите, что было сделано в рамках благоустройства..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  required
                />
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-medium mb-1">
                  Фотографии проекта
                </label>
                
                {/* Image Gallery */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-24 bg-muted">
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 flex items-center justify-center"
                        aria-label="Удалить изображение"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Upload area */}
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-4">
                  <div className="text-center space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex flex-col text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                      >
                        <span>Загрузить фотографии</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImagesChange}
                        />
                      </label>
                      <p className="pl-1">или перетащите сюда</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG до 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              <Save size={16} />
              {isSubmitting ? "Сохранение..." : "Сохранить проект"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
