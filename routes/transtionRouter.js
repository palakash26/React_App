import express from 'express';
import { sql } from './../config/db.js';


const router = express.Router();



// Get route to fetch all transactions
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // const userid = req.query.user_id;

    // if (userid !== userId) {
    //   return res.status(403).json({ message: "Forbidden: User ID mismatch" });
    // }

    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    console.log(`Fetched ${transactions.length} transactions successfully`);
    res.status(200).json(transactions);
  } catch (error) {
    console.log(`Error fetching transactions: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Post route to create a transaction
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !amount || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required.. " });
    }

    const transtion =
      await sql`INSERT INTO transactions(user_id,title,amount,category) VALUES (${user_id},${title},${amount},${category}) RETURNING *`;
    // console.log(`Transaction created successfully for user: ${transtion} `);

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: transtion[0],
    });
  } catch (error) {
    console.log(` Error creating the transaction:${error}`);
    res.status(400).json({ message: "Internal server error" });
  }
});

// Delete route to delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    4;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const deletedTransaction =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (deletedTransaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    console.log(`Transaction with ID ${id} deleted successfully`);
    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: deletedTransaction[0],
    });
  } catch (error) {
    console.log(`Error deleting transaction: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM  transactions 
      WHERE  user_id = ${userId}`;


    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions 
      WHERE user_id = ${userId} AND amount > 0`;  

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions
      WHERE user_id = ${userId} AND amount < 0`;

    console.log(`Fetched summary for user: ${userId}`);
    res.status(200).json({ balance: balanceResult[0].balance, income: incomeResult[0].income, expense: expenseResult[0].expense });
  } catch (error) {
    console.log(`Error fetching summary: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;