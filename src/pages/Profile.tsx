
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useFlashcards } from "@/hooks/useFlashcards";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { groups, createGroup, deleteGroup } = useFlashcards();
  const [username, setUsername] = useState(user?.username || "");
  const [newGroup, setNewGroup] = useState("");
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  const handleUsernameChange = () => {
    // This would update the username in a real app
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleCreateGroup = () => {
    if (newGroup.trim()) {
      createGroup(newGroup.trim());
      setNewGroup("");
    }
  };

  const handleDeleteGroup = () => {
    if (groupToDelete) {
      deleteGroup(groupToDelete);
      setGroupToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Profile Settings</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="groups">Flashcard Groups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "User")}&background=random`} 
                        alt={user?.username || "User"} 
                      />
                      <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{user?.username}</h3>
                      <p className="text-muted-foreground">User ID: {user?.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input 
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                        />
                        <Button onClick={handleUsernameChange}>Save</Button>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" onClick={logout}>Sign Out</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="groups">
              <Card>
                <CardHeader>
                  <CardTitle>Flashcard Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="New group name"
                        value={newGroup}
                        onChange={(e) => setNewGroup(e.target.value)}
                      />
                      <Button onClick={handleCreateGroup}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Group
                      </Button>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-3">Your Groups</h3>
                      
                      {groups.length === 0 ? (
                        <p className="text-muted-foreground">No groups created yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {groups.map((group) => (
                            <li key={group} className="flex justify-between items-center p-3 border rounded-md">
                              <span>{group}</span>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => setGroupToDelete(group)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete group</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the "{group}" group? 
                                      Flashcards in this group will not be deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setGroupToDelete(null)}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={handleDeleteGroup}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
