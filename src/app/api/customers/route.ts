'use server'

import { db } from "@/db/client";
import { customers } from "@/db/schema";
import { auth } from "@/auth";
import { nanoid } from 'nanoid';
import { sql, desc } from 'drizzle-orm';

// GET /api/customers - Fetch all customers
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt));

    return new Response(JSON.stringify(allCustomers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch customers' 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, status, facebookProfileUrl, contactProfile, email, groupsPurchased } = body;

    // Basic validation
    if (!name || !status) {
      return new Response('Missing required fields: name and status', { status: 400 });
    }

    // Validate status enum
    const validStatuses = ["Potential Customer / negotiating", "Paid few groups", "Paid full groups"];
    if (!validStatuses.includes(status)) {
        return new Response('Invalid status value', { status: 400 });
    }

    // Validate groupsPurchased is an array if provided
    if (groupsPurchased && !Array.isArray(groupsPurchased)) {
      return new Response('groupsPurchased must be an array of strings', { status: 400 });
    }

    const id = nanoid(); // Generate unique ID

    const newCustomerData = {
      id,
      name,
      status,
      facebookProfileUrl: facebookProfileUrl || null,
      contactProfile: contactProfile || null,
      email: email || null,
      groupsPurchased: groupsPurchased || [], // Default to empty array if not provided
      // createdAt and updatedAt will use default values from schema
    };

    const [createdCustomer] = await db.insert(customers)
      .values(newCustomerData)
      .returning(); // Return the created customer object

    return new Response(JSON.stringify(createdCustomer), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    // Handle potential unique constraint errors or other DB errors if necessary
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to create customer' 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Note: Implement PUT/PATCH for updates and DELETE for removals as needed later. 