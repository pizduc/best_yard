
import { useState, useEffect } from 'react';
import { ArrowRight, Award, Vote, Image } from 'lucide-react';
import VoteModal from './VoteModal';
import ProjectDetailsModal from './ProjectDetailsModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Project = {
  id: number;
  title: string;
  address: string;
  description: string;
  image: string;
  images: string[];
  year: number;
  link: string;
  vote_count?: number;
};

const ProjectShowcase = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const years = [2025, 2024, 2023, 2022, 2021, 2020];

  // Загрузка проектов
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://best-yard.onrender.com/api/projects");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Loaded projects:", data);
        setProjects(data);
      } catch (error) {
        console.error("Ошибка при загрузке проектов:", error);
        toast.error("Не удалось загрузить проекты. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => project.year === selectedYear);

  // Загружаем данные о голосах
  useEffect(() => {
    if (filteredProjects.length === 0 || loading) return;

    const fetchVotes = async () => {
      try {
        const updatedProjects = await Promise.all(
          filteredProjects.map(async (project) => {
            try {
              const res = await fetch(`https://best-yard.onrender.com/api/votes/count/${project.id}`);
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              const data = await res.json();
              return {
                ...project,
                vote_count: data.voteCount || 0,
              };
            } catch (error) {
              console.error(`Ошибка при получении голосов для проекта ${project.id}:`, error);
              return project; // Возвращаем проект без изменения счетчика голосов
            }
          })
        );

        // Обновляем список проектов с учетом добавленных голосов
        setProjects(prevProjects => {
          const projectsWithoutFiltered = prevProjects.filter(p => p.year !== selectedYear);
          return [...projectsWithoutFiltered, ...updatedProjects];
        });
      } catch (error) {
        console.error('Ошибка при получении данных о голосах:', error);
      }
    };

    fetchVotes();
  }, [selectedYear, filteredProjects, loading]);

  const getWinners = (projects: Project[]): Record<number, { maxVotes: number, winners: Project[] }> => {
    const winnersByYear: Record<number, { maxVotes: number; winners: Project[] }> = {};

    projects.forEach(project => {
      const { year, vote_count = 0 } = project;

      if (!winnersByYear[year]) {
        winnersByYear[year] = { maxVotes: vote_count, winners: [project] };
      } else if (vote_count > winnersByYear[year].maxVotes) {
        winnersByYear[year] = { maxVotes: vote_count, winners: [project] };
      } else if (vote_count === winnersByYear[year].maxVotes) {
        winnersByYear[year].winners.push(project);
      }
    });

    return winnersByYear;
  };

  const winnersByYear = getWinners(projects);
  const winnersForSelectedYear = winnersByYear[selectedYear]?.winners || [];

  const handleVoteClick = (project: Project) => {
    setSelectedProject(project);
    setIsVoteModalOpen(true);
  };

  const handleDetailsClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  return (
    <section id="projects" className="py-24 bg-secondary/30">
      <div className="section-container">
        {/* Заголовки и выбор года */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Проекты благоустройства</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Лучшие проекты благоустройства дворов и общественных территорий по годам.
            Выберите год и изучите проекты, а также проголосуйте за понравившиеся.
          </p>
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {years.map(year => (
              <button
                key={year}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  selectedYear === year ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Индикатор загрузки */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
          </div>
        )}

        {/* Сообщение если нет проектов */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">На данный год проектов не найдено.</p>
          </div>
        )}

        {/* Сетка проектов */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const isWinner = winnersForSelectedYear.some(w => w.id === project.id);

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group animate-fade-up"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="relative h-64 overflow-hidden image-shine">
                  <img
  src={project.image.startsWith('http') ? project.image : `https://${project.image}`}
  alt={project.title}
  referrerPolicy="no-referrer"
  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  onError={(e) => {
    console.error("Ошибка загрузки изображения:", project.image);
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
  }}
/>
                  {isWinner && (
                    <div className="absolute top-4 right-4 bg-primary text-white rounded-full py-1 px-3 flex items-center gap-1 text-sm shadow-md">
                      <Award size={16} />
                      <span>Победитель</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">{project.address}</div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="mt-2 text-muted-foreground line-clamp-3">{project.description}</p>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleVoteClick(project)}
                        className="flex items-center text-sm text-primary font-medium gap-2 hover:underline"
                      >
                        <Vote size={16} />
                        Проголосовать
                      </button>
                      <span className="text-sm text-muted-foreground">{project.vote_count || 0} 👍</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleDetailsClick(project)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Image size={16} />
                      Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Кнопка подать проект */}
        <div className="text-center mt-12">
          <a
            href="#participation"
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Подать свой проект
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>

        {/* Модалки */}
        {selectedProject && (
          <>
            <VoteModal
              isOpen={isVoteModalOpen}
              onClose={() => setIsVoteModalOpen(false)}
              project={selectedProject}
            />
            <ProjectDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
              project={selectedProject}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectShowcase;
