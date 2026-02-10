import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function ComponentShowcase() {
  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-2">Component Showcase</h1>
        <p className="text-muted-foreground">
          Preview of all ShadCN/UI components configured for Kitchen Manager
        </p>
      </div>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Card</CardTitle>
              <CardDescription>
                A delicious recipe for your collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is what a recipe card will look like in the application.
                It includes a title, description, and content area for recipe
                details.
              </p>
            </CardContent>
            <CardFooter>
              <Button>View Recipe</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shopping List</CardTitle>
              <CardDescription>Items needed for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge>Vegetables</Badge>
                <Badge variant="secondary">Dairy</Badge>
                <Badge variant="outline">Proteins</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Form Inputs</h2>
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Recipe Name</Label>
            <Input id="name" placeholder="Enter recipe name..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your recipe..."
              rows={4}
            />
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>dinner</Badge>
          <Badge>chicken</Badge>
          <Badge>quick</Badge>
          <Badge variant="secondary">vegetarian</Badge>
          <Badge variant="secondary">gluten-free</Badge>
          <Badge variant="outline">&lt; 30 min</Badge>
          <Badge variant="outline">easy</Badge>
          <Badge variant="destructive">spicy</Badge>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Skeleton Loaders</h2>
        <div className="space-y-2 max-w-md">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-32 w-full mt-4" />
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
            <p className="text-sm text-muted-foreground">
              text-4xl font-bold tracking-tight
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Heading 2</h2>
            <p className="text-sm text-muted-foreground">
              text-3xl font-bold tracking-tight
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Heading 3</h3>
            <p className="text-sm text-muted-foreground">
              text-2xl font-semibold
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Heading 4</h4>
            <p className="text-sm text-muted-foreground">
              text-xl font-semibold
            </p>
          </div>
          <div>
            <p className="text-base">Body text (default size)</p>
            <p className="text-sm text-muted-foreground">text-base</p>
          </div>
          <div>
            <p className="text-sm">Small text</p>
            <p className="text-sm text-muted-foreground">text-sm</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Muted text</p>
            <p className="text-sm text-muted-foreground">
              text-sm text-muted-foreground
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-4">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-20 bg-background border rounded-md" />
            <p className="text-sm font-medium">Background</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-md" />
            <p className="text-sm font-medium">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-secondary rounded-md" />
            <p className="text-sm font-medium">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-muted rounded-md" />
            <p className="text-sm font-medium">Muted</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-accent rounded-md" />
            <p className="text-sm font-medium">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-destructive rounded-md" />
            <p className="text-sm font-medium">Destructive</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-card border rounded-md" />
            <p className="text-sm font-medium">Card</p>
          </div>
        </div>
      </section>
    </div>
  )
}
