import { NextResponse } from 'next/server';
import { db } from "@/db/client";
import { customers } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from 'drizzle-orm';

// GET a single customer
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const customer = await db.select().from(customers).where(eq(customers.id, id));

    if (!customer.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT to update a customer
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();
    
    const { name, status, facebookProfileUrl, contactProfile, email, groupsPurchased } = body;

    // Basic validation
    if (!name || !status) {
      return NextResponse.json({ error: 'Missing required fields: name and status' }, { status: 400 });
    }

    // Validate status enum
    const validStatuses = ["Potential Customer / negotiating", "Paid few groups", "Paid full groups"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Check if customer exists
    const existingCustomer = await db.select().from(customers).where(eq(customers.id, id));
    if (!existingCustomer.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const updateData = {
      name,
      status,
      facebookProfileUrl: facebookProfileUrl || null,
      contactProfile: contactProfile || null,
      email: email || null,
      groupsPurchased: groupsPurchased || [],
      updatedAt: new Date(), // Update the timestamp
    };

    const [updatedCustomer] = await db
      .update(customers)
      .set(updateData)
      .where(eq(customers.id, id))
      .returning();

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE a customer
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // Check if customer exists
    const existingCustomer = await db.select().from(customers).where(eq(customers.id, id));
    if (!existingCustomer.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Delete the customer
    await db.delete(customers).where(eq(customers.id, id));

    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete customer' },
      { status: 500 }
    );
  }
} 