import { NextRequest, NextResponse } from 'next/server';

const shouldReturnError = false;
const shouldReturnEmpty = false;

const mockDashboardResponse = {
  totalItems: 120,
  totalQuantity: 4500,
  lowStock: 18,
  outOfStock: 5
};

export async function GET(req: NextRequest) {

  await new Promise(resolve => setTimeout(resolve, 1500));

  if (shouldReturnError) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } else if (shouldReturnEmpty) {
    return NextResponse.json({}, { status: 200 });
  } else {
    return NextResponse.json(mockDashboardResponse, { status: 200 });
  }
}

