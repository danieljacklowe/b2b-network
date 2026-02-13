import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { secret?: string };
}) {
  // 1. Get the real secret from the environment
  const trueSecret = process.env.ADMIN_SECRET;

  // 2. FAIL SAFE CHECK:
  // If the environment variable is missing (undefined), BLOCK ACCESS.
  // If the user's secret doesn't match, BLOCK ACCESS.
  if (!trueSecret || searchParams.secret !== trueSecret) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Access Denied 🔒</h1>
          <p className="mt-2 text-gray-600">
            Incorrect or missing password.
          </p>
        </div>
      </div>
    );
  }

  // ... (Keep the rest of the code the same)

  // 2. Fetch Data: Get all applicants from Neon, newest first
  const applicants = await prisma.waitlistApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 3. Render the Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          🚀 Admin Dashboard
          <span className="ml-4 text-sm font-normal text-gray-500">
            Total Applicants: {applicants.length}
          </span>
        </h1>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  LinkedIn / Deal Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {applicants.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{user.linkedIn || "N/A"}</div>
                    <div className="text-xs text-blue-600">{user.dealSize}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}