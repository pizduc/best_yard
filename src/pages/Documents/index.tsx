import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
  } from "@/components/ui/card";
  import { ArrowLeft, FileText, Info, Shield, Award, HelpCircle } from "lucide-react";
  import { Link } from "react-router-dom";
  import Header from "@/components/Header";
  import Footer from "@/components/Footer";
  
  const DocumentsPage = () => {
    const documents = [
      {
        title: "Положение о конкурсе",
        description: "Официальный документ, регламентирующий порядок проведения конкурса",
        icon: <Info className="h-8 w-8 text-primary" />,
        link: "/documents/regulations"
      },
      {
        title: "Правила участия",
        description: "Подробная информация о том, как принять участие в конкурсе",
        icon: <FileText className="h-8 w-8 text-primary" />,
        link: "/documents/participation-rules"
      },
      {
        title: "Критерии оценки",
        description: "Информация о том, как оцениваются проекты в конкурсе",
        icon: <Award className="h-8 w-8 text-primary" />,
        link: "/documents/evaluation-criteria"
      },
      {
        title: "Часто задаваемые вопросы",
        description: "Ответы на популярные вопросы о конкурсе",
        icon: <HelpCircle className="h-8 w-8 text-primary" />,
        link: "/documents/faq"
      },
      {
        title: "Политика конфиденциальности",
        description: "Информация о том, как мы обрабатываем персональные данные",
        icon: <Shield className="h-8 w-8 text-primary" />,
        link: "/documents/privacy-policy"
      }
    ];
  
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-10 px-4">
  
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Документы</h1>
            <p className="text-muted-foreground text-lg">
              Информация о конкурсе "Лучший двор города Кемерово", правилах участия и других важных аспектах
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <Link key={index} to={doc.link} className="block hover:scale-105 transition-transform">
                <Card className="h-full border-primary/10 hover:border-primary/30 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      {doc.icon}
                    </div>
                    <div>
                      <CardTitle>{doc.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{doc.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <div className="text-primary text-sm font-medium">Подробнее →</div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  };
  
  export default DocumentsPage;
  