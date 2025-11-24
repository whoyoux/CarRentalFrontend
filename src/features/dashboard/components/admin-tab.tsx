import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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

const AdminTab = () => (
  <div className="flex flex-col gap-4">
    <HeaderPanel />
    <UsersList />
  </div>
);

const HeaderPanel = () => (
  <Card>
    <CardHeader>
      <CardTitle>Actions</CardTitle>
      <CardDescription>Only admin can access these actions</CardDescription>
      <CardAction>
        <Button>Add car</Button>
      </CardAction>
    </CardHeader>
  </Card>
);

const UsersList = () => (
  <Card>
    <CardHeader>
      <CardTitle>Users list</CardTitle>
      <CardDescription>List of all users</CardDescription>
    </CardHeader>
    <CardContent>
      <UsersTable />
    </CardContent>
    <CardFooter>Footer</CardFooter>
  </Card>
);

const UsersTable = () => (
  <Table>
    <TableCaption>A list of users.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Icon</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Count of rentals</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <CircleUserRound />
        </TableCell>
        <TableCell>user@example.com</TableCell>
        <TableCell>10</TableCell>
        <TableCell className="text-right">$250.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <CircleUserRound />
        </TableCell>
        <TableCell>user@example.com</TableCell>
        <TableCell>10</TableCell>
        <TableCell className="text-right">$250.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <CircleUserRound />
        </TableCell>
        <TableCell>user@example.com</TableCell>
        <TableCell>10</TableCell>
        <TableCell className="text-right">$250.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <CircleUserRound />
        </TableCell>
        <TableCell>user@example.com</TableCell>
        <TableCell>10</TableCell>
        <TableCell className="text-right">$250.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <CircleUserRound />
        </TableCell>
        <TableCell>user@example.com</TableCell>
        <TableCell>10</TableCell>
        <TableCell className="text-right">$250.00</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default AdminTab;
