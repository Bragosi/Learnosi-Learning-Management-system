import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApprovedStudents from "./_components/ApprovedStudents";
import AddStudentForm from "./_components/AddStudentForm";
import { AdminGetApprovedStudents } from "@/app/data/admin/AdminGetApprovedStudents";

export default async function AddStudents() {
  const approvedStudents = await AdminGetApprovedStudents()
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl text-primary font-bold tracking-tight">
          Manage Students
        </h1>
        <p className="text-muted-foreground mt-1">
          Approve and manage student access to Learnosi
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="approved-students" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="approved-students"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Approved Students
          </TabsTrigger>

          <TabsTrigger
            value="add-students"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Add Student
          </TabsTrigger>
        </TabsList>

        {/* Approved Students Tab */}
        <TabsContent value="approved-students">
          <Card className="border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">
                Approved Students
              </CardTitle>
              <CardDescription>
                View, manage, or remove students who have access to Learnosi
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <ApprovedStudents data={approvedStudents} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Students Tab */}
        <TabsContent value="add-students">
          <Card className="border shadow-sm">
            <CardContent className="pt-2">
              <AddStudentForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}