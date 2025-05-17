import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Project } from "@/types"; // если типы хранятся отдельно

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const ProjectDetailsModal = ({
  isOpen,
  onClose,
  project,
}: ProjectDetailsModalProps) => {
  // Используем реальные изображения или одно главное, если массив пуст
  const projectImages = project.images?.length > 0 ? project.images : [project.image];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Закрыть</span>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
          <DialogDescription className="text-base">
            {project.address} • {project.year} год
            {project.isWinner && (
              <span className="ml-2 inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                Победитель конкурса
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-6">
            <Carousel className="w-full">
              <CarouselContent>
                {projectImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <img
  src={image.startsWith('http') ? image : `https://${image}`}
  alt={`${project.title} - фото ${index + 1}`}
  className="w-full object-cover h-[400px]"
  onError={(e) => {
    console.error("Ошибка загрузки изображения:", image);
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
  }}
/>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-2">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>

          <p className="text-muted-foreground mb-6">{project.description}</p>

          <div className="flex justify-end">
            <Button variant="default" asChild>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span>Посетить сайт проекта</span>
                <ExternalLink size={16} />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
