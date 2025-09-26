import { useState } from "react";
import { 
  Search, 
  Clock, 
  User, 
  Tag, 
  ArrowRight, 
  Mail,
  Download,
  Star,
  Calendar,
  Eye,
  Share2,
  BookOpen
} from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Mock data
  const featuredPost = {
    id: 1,
    title: "How SCMC is Transforming Mathematical Education in Nigeria",
    excerpt: "Discover how the Scholars Cambridge Mathematics Competition is revolutionizing the way students approach mathematics across Nigerian schools, fostering critical thinking and problem-solving skills.",
    image: "/placeholder.svg",
    author: {
      name: "Dr. Adebayo Johnson",
      avatar: "/placeholder.svg",
      role: "Education Director"
    },
    publishedAt: "2024-01-20",
    readTime: "8 min read",
    tags: ["Education", "Mathematics", "Impact"],
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: "5 Study Strategies That Help Students Excel in Mathematics",
      excerpt: "Proven techniques and methods that top-performing students use to master mathematical concepts and excel in competitions.",
      image: "/placeholder.svg",
      author: {
        name: "Mrs. Kemi Adebola",
        avatar: "/placeholder.svg",
        role: "Mathematics Teacher"
      },
      publishedAt: "2024-01-18",
      readTime: "6 min read",
      tags: ["Study Tips", "Mathematics", "Students"],
      featured: false
    },
    {
      id: 3,
      title: "Building Confidence in Young Mathematicians",
      excerpt: "How parents and teachers can nurture mathematical confidence in children from an early age, creating lifelong learners.",
      image: "/placeholder.svg",
      author: {
        name: "Prof. Chioma Okeke",
        avatar: "/placeholder.svg",
        role: "Educational Psychologist"
      },
      publishedAt: "2024-01-15",
      readTime: "7 min read",
      tags: ["Psychology", "Education", "Confidence"],
      featured: false
    },
    {
      id: 4,
      title: "The Role of Technology in Modern Mathematics Education",
      excerpt: "Exploring how digital tools and platforms are reshaping mathematics education and making complex concepts more accessible.",
      image: "/placeholder.svg",
      author: {
        name: "Engr. Tunde Olatunji",
        avatar: "/placeholder.svg",
        role: "EdTech Specialist"
      },
      publishedAt: "2024-01-12",
      readTime: "9 min read",
      tags: ["Technology", "Education", "Innovation"],
      featured: false
    },
    {
      id: 5,
      title: "Success Stories: Students Who Changed Their Mathematical Journey",
      excerpt: "Inspiring stories of students who overcame mathematical challenges and achieved excellence through determination and support.",
      image: "/placeholder.svg",
      author: {
        name: "Sarah Okonkwo",
        avatar: "/placeholder.svg",
        role: "Student Coordinator"
      },
      publishedAt: "2024-01-10",
      readTime: "5 min read",
      tags: ["Success Stories", "Inspiration", "Students"],
      featured: false
    },
    {
      id: 6,
      title: "Preparing for International Mathematics Competitions",
      excerpt: "A comprehensive guide for students and coaches on preparing for prestigious international mathematics competitions.",
      image: "/placeholder.svg",
      author: {
        name: "Dr. Mohammed Bello",
        avatar: "/placeholder.svg",
        role: "Competition Director"
      },
      publishedAt: "2024-01-08",
      readTime: "12 min read",
      tags: ["Competitions", "International", "Preparation"],
      featured: false
    },
    {
      id: 7,
      title: "The Impact of Mathematics on Career Development",
      excerpt: "How strong mathematical foundations open doors to diverse career opportunities in the modern economy.",
      image: "/placeholder.svg",
      author: {
        name: "Dr. Grace Adeniyi",
        avatar: "/placeholder.svg",
        role: "Career Counselor"
      },
      publishedAt: "2024-01-05",
      readTime: "8 min read",
      tags: ["Careers", "Mathematics", "Future"],
      featured: false
    }
  ];

  const popularPosts = blogPosts.slice(0, 5);
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            SCMC Blog
          </h1>
          <h2 className="text-2xl md:text-3xl text-primary mb-8">
            Insights, Stories & Educational Excellence
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Discover the latest insights on mathematics education, student success stories, 
            and expert advice from Nigeria's leading educational competition.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlassButton size="lg" variant="primary">
              <BookOpen className="w-5 h-5" />
              Read Latest
            </GlassButton>
            <GlassButton size="lg" variant="secondary">
              <Mail className="w-5 h-5" />
              Write for Us
            </GlassButton>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Featured Post */}
        <section className="mb-16">
          <GlassCard className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-secondary-orange/20 text-secondary-orange">Featured</Badge>
                  <Badge className="bg-primary/20 text-primary">Latest</Badge>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {featuredPost.title}
                </h2>
                
                <p className="text-lg text-muted-foreground mb-6">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                    <AvatarFallback>{featuredPost.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{featuredPost.author.name}</div>
                    <div className="text-sm text-muted-foreground">{featuredPost.author.role}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredPost.publishedAt)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="glass">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <GlassButton variant="primary" size="lg">
                  Read Full Article
                  <ArrowRight className="w-4 h-4" />
                </GlassButton>
              </div>
              
              <div className="relative">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-80 lg:h-96 object-cover rounded-base glass-card"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-base"></div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Search and Filter Section */}
        <section className="mb-12">
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag("")}
                  className={cn(
                    "px-4 py-2 rounded-base text-sm transition-colors",
                    !selectedTag 
                      ? "bg-primary text-primary-foreground" 
                      : "glass text-foreground hover:bg-white/10"
                  )}
                >
                  All Topics
                </button>
                {allTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "px-4 py-2 rounded-base text-sm transition-colors",
                      selectedTag === tag 
                        ? "bg-primary text-primary-foreground" 
                        : "glass text-foreground hover:bg-white/10"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <GlassCard key={post.id} className="p-6 hover-glass">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-base mb-4"
                  />
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{post.author.name}</div>
                      <div className="text-xs text-muted-foreground">{post.author.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <button className="hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <GlassButton variant="ghost" className="w-full">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </GlassButton>
                </GlassCard>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <GlassButton variant="secondary" size="lg">
                Load More Articles
              </GlassButton>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter Signup */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest insights and updates delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input placeholder="Your email address" className="glass-card" />
                <GlassButton variant="primary" className="w-full">
                  <Mail className="w-4 h-4" />
                  Subscribe
                </GlassButton>
              </div>
            </GlassCard>

            {/* Popular Articles */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Popular Articles</h3>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <div key={post.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Tags Cloud */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "px-3 py-1 rounded-base text-sm transition-colors",
                      selectedTag === tag 
                        ? "bg-primary text-primary-foreground" 
                        : "glass text-foreground hover:bg-white/10"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Download Media Kit */}
            <GlassCard className="p-6 text-center">
              <Download className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Media Kit</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download our complete media kit with logos, brand guidelines, and press materials.
              </p>
              <GlassButton variant="secondary" className="w-full">
                <Download className="w-4 h-4" />
                Download Kit
              </GlassButton>
            </GlassCard>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;