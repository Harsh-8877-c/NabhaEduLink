import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  GraduationCap, School, Users, BookOpen, 
  Upload, Plus, Eye, Check, X, TrendingUp,
  BarChart3, Settings, Shield
} from "lucide-react";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('schools');

  const adminStats = {
    totalUsers: 1247,
    schools: 23,
    teachers: 156,
    students: 1068,
    contentItems: 342,
    pendingApprovals: 5
  };

  const schools = [
    {
      id: 1,
      name: "Government Senior Secondary School",
      location: "Nabha, Punjab",
      teachers: 24,
      students: 456,
      status: "active"
    },
    {
      id: 2,
      name: "DAV Public School",
      location: "Nabha, Punjab",
      teachers: 18,
      students: 312,
      status: "active"
    }
  ];

  const pendingContent = [
    {
      id: 1,
      title: "Advanced Typing Techniques",
      submittedBy: "Teacher Kaur",
      type: "lesson",
      status: "pending_review"
    },
    {
      id: 2,
      title: "Internet Safety Quiz",
      submittedBy: "Teacher Singh",
      type: "quiz",
      status: "pending_review"
    }
  ];

  if (!user || user.userType !== 'teacher' || !user.isAdmin) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">Nabha Learning</h1>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                  <Settings className="text-destructive-foreground text-sm" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-card-foreground" data-testid="text-username">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  data-testid="button-logout"
                >
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-destructive/20 to-accent/20 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">Admin Portal</h2>
                <p className="text-muted-foreground">
                  Manage schools, teachers, students, and content across the platform
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-accent" data-testid="text-total-users">
                  {adminStats.totalUsers}
                </div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Schools</CardTitle>
                <School className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{adminStats.schools}</div>
              <div className="text-sm text-green-400">+2 this month</div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Teachers</CardTitle>
                <Users className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{adminStats.teachers}</div>
              <div className="text-sm text-green-400">+8 this month</div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Students</CardTitle>
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{adminStats.students}</div>
              <div className="text-sm text-green-400">+45 this month</div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Content Items</CardTitle>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{adminStats.contentItems}</div>
              <div className="text-sm text-yellow-400">{adminStats.pendingApprovals} pending approval</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Management Tabs */}
        <Card className="border-border bg-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border">
              <TabsList className="w-full h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="schools" 
                  className="flex-1 py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none"
                >
                  Schools
                </TabsTrigger>
                <TabsTrigger 
                  value="teachers" 
                  className="flex-1 py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none"
                >
                  Teachers
                </TabsTrigger>
                <TabsTrigger 
                  value="students" 
                  className="flex-1 py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none"
                >
                  Students
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="flex-1 py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none"
                >
                  Content
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex-1 py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent rounded-none"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Schools Tab */}
            <TabsContent value="schools" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">School Management</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    data-testid="button-bulk-import"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Bulk Import
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-add-school"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add School
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="text-left py-3 px-4">School Name</TableHead>
                      <TableHead className="text-left py-3 px-4">Location</TableHead>
                      <TableHead className="text-left py-3 px-4">Teachers</TableHead>
                      <TableHead className="text-left py-3 px-4">Students</TableHead>
                      <TableHead className="text-left py-3 px-4">Status</TableHead>
                      <TableHead className="text-left py-3 px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id} className="border-b border-border hover:bg-secondary/50" data-testid={`row-school-${school.id}`}>
                        <TableCell className="py-3 px-4 font-medium text-card-foreground">
                          {school.name}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-muted-foreground">
                          {school.location}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-muted-foreground">
                          {school.teachers}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-muted-foreground">
                          {school.students}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary/80"
                              data-testid={`button-edit-school-${school.id}`}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive/80"
                              data-testid={`button-suspend-school-${school.id}`}
                            >
                              Suspend
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Content Tab */}
            <TabsContent value="content" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">Content Management</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-testid="button-review-queue"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review Queue ({adminStats.pendingApprovals})
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-add-content"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Content
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingContent.map((content) => (
                  <Card key={content.id} className="bg-secondary border border-border" data-testid={`content-card-${content.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                          Pending Review
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80 p-1"
                          data-testid={`button-reject-${content.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <h4 className="font-medium text-card-foreground mb-1">{content.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Submitted by: {content.submittedBy}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-500 text-white hover:bg-green-600"
                          data-testid={`button-approve-${content.id}`}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive/10"
                          data-testid={`button-reject-detailed-${content.id}`}
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="bg-secondary border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        Published
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground p-1"
                        data-testid="button-edit-published-content"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-card-foreground mb-1">Basic File Management</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Views: 1,234 | Rating: 4.8/5
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Last updated: 2 days ago
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span>Platform Growth</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">New Users This Month</span>
                        <span className="text-lg font-semibold text-green-400">+55</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Content Views</span>
                        <span className="text-lg font-semibold text-primary">12.4K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Session Time</span>
                        <span className="text-lg font-semibold text-accent">24 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-accent" />
                      <span>Content Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Most Popular</span>
                        <span className="text-sm font-medium text-card-foreground">Digital Literacy</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completion Rate</span>
                        <span className="text-sm font-medium text-green-400">87%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Score</span>
                        <span className="text-sm font-medium text-primary">84%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Teachers Tab Placeholder */}
            <TabsContent value="teachers" className="p-6">
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Teacher Management</h3>
                <p className="text-muted-foreground">Manage teacher accounts, permissions, and performance.</p>
              </div>
            </TabsContent>

            {/* Students Tab Placeholder */}
            <TabsContent value="students" className="p-6">
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Student Management</h3>
                <p className="text-muted-foreground">Manage student accounts, progress, and class assignments.</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
