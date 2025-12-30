import React from 'react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog"
import { Box, Flex, Grid } from '../ui/AppLayout';
import { Heading, Text, Paragraph, Code } from '../ui/AppTypography';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Checkbox } from '../ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Skeleton } from '../ui/Skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/Breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { List, ListItem } from '../ui/List';
import { AlertTriangle, Terminal, Settings } from 'lucide-react';

export const DesignSystemView: React.FC = () => {
    return (
        <div className="p-8 space-y-16 pb-32 overflow-y-auto h-full bg-background text-foreground">
            <div className="space-y-4">
                <Heading size="h1" className="text-primary">Design System Showcase</Heading>
                <Text size="lg" variant="muted">
                    Comprehensive verification of tokens, typography, and all core components.
                </Text>
            </div>

            {/* Layout Section */}
            <section className="space-y-6">
                <Heading size="h2" className="border-b border-border pb-2">Layout Primitives</Heading>
                <div className="space-y-4">
                    <Text variant="muted">Flex & Grid examples</Text>
                    <Flex gap="md" className="p-4 border rounded-lg bg-card">
                        <Box className="p-4 bg-primary/20 rounded">Flex Item 1</Box>
                        <Box className="p-4 bg-primary/20 rounded">Flex Item 2</Box>
                        <Box className="p-4 bg-primary/20 rounded">Flex Item 3</Box>
                    </Flex>
                    <Grid cols={3} gap="md" className="p-4 border rounded-lg bg-card">
                        <Box className="p-4 bg-secondary/50 rounded text-center">Grid 1</Box>
                        <Box className="p-4 bg-secondary/50 rounded text-center">Grid 2</Box>
                        <Box className="p-4 bg-secondary/50 rounded text-center">Grid 3</Box>
                        <Box className="p-4 bg-secondary/50 rounded text-center col-span-3">Grid Full Width</Box>
                    </Grid>
                </div>
            </section>

            {/* Typography Section */}
            <section className="space-y-6">
                <Heading size="h2" className="border-b border-border pb-2">Typography</Heading>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <Text variant="muted" size="sm">Headings (Outfit)</Text>
                        <Heading size="h1">Heading 1</Heading>
                        <Heading size="h2">Heading 2</Heading>
                        <Heading size="h3">Heading 3</Heading>
                        <Heading size="h4">Heading 4</Heading>
                    </div>
                    <div className="space-y-4">
                        <Text variant="muted" size="sm">Body & Code (Inter / JetBrains Mono)</Text>
                        <Paragraph>
                            This is a standard paragraph using the <Code>Paragraph</Code> component. It has optimized line-height for readability.
                            The design system uses <Code>Inter</Code> for body text and <Code>Outfit</Code> for headings.
                        </Paragraph>
                        <div className="space-y-2">
                            <Text className="block">Standard Text</Text>
                            <Text variant="muted" className="block">Muted Text</Text>
                            <Text variant="accent" className="block">Accent Text</Text>
                            <Text variant="danger" className="block">Danger Text</Text>
                        </div>
                    </div>
                </div>
            </section>

            {/* Buttons Section */}
            <section className="space-y-6">
                <Heading size="h2" className="border-b border-border pb-2">Buttons</Heading>
                <Flex wrap="wrap" gap="md">
                    <Button variant="default">Primary Action</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="premium">Premium AI</Button>
                </Flex>
                <Flex wrap="wrap" gap="md" align="center">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><Settings className="w-4 h-4" /></Button>
                </Flex>
            </section>

            {/* Form Section */}
            <section className="space-y-6">
                <Heading size="h2" className="border-b border-border pb-2">Form Components</Heading>
                <Grid cols={1} className="md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Input Field</Label>
                            <Input placeholder="Type something..." />
                        </div>
                        <div className="grid gap-2">
                            <Label>Select Dropdown</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Themes</SelectLabel>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <Flex align="center" gap="md">
                            <Switch id="airplane-mode" />
                            <Label htmlFor="airplane-mode">Airplane Mode (Switch)</Label>
                        </Flex>
                        <Flex align="center" gap="md">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Accept terms and conditions (Checkbox)</Label>
                        </Flex>
                        <div className="space-y-2">
                            <Label>Notifications (Radio)</Label>
                            <RadioGroup defaultValue="all">
                                <Flex align="center" gap="sm">
                                    <RadioGroupItem value="all" id="r1" />
                                    <Label htmlFor="r1">All new messages</Label>
                                </Flex>
                                <Flex align="center" gap="sm">
                                    <RadioGroupItem value="mentions" id="r2" />
                                    <Label htmlFor="r2">Direct messages and mentions</Label>
                                </Flex>
                            </RadioGroup>
                        </div>
                    </div>
                </Grid>
            </section>

            {/* Feedback Section */}
            <section className="space-y-6">
                <Heading size="h2" className="border-b border-border pb-2">Feedback & Status</Heading>
                <div className="grid gap-4">
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            You can add components to your app using the cli.
                        </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Your session has expired. Please log in again.
                        </AlertDescription>
                    </Alert>
                    
                    <Flex gap="md" align="center">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="success">Success</Badge>
                    </Flex>

                    <div className="space-y-2 max-w-md">
                        <Label>Progress</Label>
                        <Progress value={60} />
                    </div>

                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Section */}
            <section className="space-y-6">
                <Heading size="h2" className="border-b border-border pb-2">Navigation</Heading>
                
                <div className="space-y-4">
                    <Text variant="muted" size="sm">Breadcrumb</Text>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="space-y-4">
                    <Text variant="muted" size="sm">Tabs</Text>
                    <Tabs defaultValue="account" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>
                                    <CardDescription>Make changes to your account here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue="Pedro Duarte" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save changes</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>Change your password here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="current">Current password</Label>
                                        <Input id="current" type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Data Display Section */}
            <section className="space-y-6">
                <Heading size="h2" className="border-b border-border pb-2">Data Display</Heading>
                
                <Flex gap="md" align="center">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <Text size="sm" weight="medium">Avatar Examples</Text>
                        <Text size="xs" variant="muted">With image and fallback</Text>
                    </div>
                </Flex>

                <div className="border rounded-md">
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">INV001</TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">INV002</TableCell>
                                <TableCell>Pending</TableCell>
                                <TableCell>PayPal</TableCell>
                                <TableCell className="text-right">$150.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="space-y-2">
                    <Text weight="medium">List Component</Text>
                    <List variant="default">
                        <ListItem>First item in a disc list</ListItem>
                        <ListItem>Second item has some content</ListItem>
                        <ListItem>Third item is here</ListItem>
                    </List>
                </div>
            </section>

             {/* Dialogs Section */}
             <section className="space-y-6">
                <Heading size="h2" className="border-b border-border pb-2">Dialogs (Modals)</Heading>
                <div className="flex flex-wrap gap-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="premium">Open Premium Dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" defaultValue="Guilherme Corrêa" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" defaultValue="@c0rreagui" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button variant="premium">Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </section>
        </div>
    );
};
