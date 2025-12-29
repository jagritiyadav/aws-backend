import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./db";
import { items } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Pollution App Backend Running");
});

app.post("/items", async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const newItem = await db.insert(items).values({ name, description }).returning();
        res.json(newItem[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create item" });
    }
});

app.get("/items", async (req: Request, res: Response) => {
    try {
        const allItems = await db.select().from(items);
        res.json(allItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

app.get("/items/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await db.query.items.findFirst({
            where: eq(items.id, Number(id))
        });
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch item" });
    }
});

app.put("/items/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedItem = await db.update(items)
            .set({ name, description })
            .where(eq(items.id, Number(id)))
            .returning();
        res.json(updatedItem[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to update item" });
    }
});

app.delete("/items/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.delete(items).where(eq(items.id, Number(id)));
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete item" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
