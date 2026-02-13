import { PrismaClient } from "@prisma/client";
import ApproveButton from "./ApproveButton"; // Import the button

const prisma = new PrismaClient();

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { secret?: string };
}) {
  const trueSecret = process.env.ADMIN_SECRET;

  if (!trueSecret || searchParams.secret !== trueSecret) {
    return <div className="p-10 text-center text-red-600 font-bold">Access Denied 🔒</div>;
  }

  const applicants = await prisma.waitlistApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          WarmDoor <span className="text-orange-600">Admin</span>
        </h1>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {applicants.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.status === "APPROVED" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.status !== "APPROVED" && (
                      <ApproveButton 
                        id={user.id} 
                        email={user.email} 
                        firstName={user.firstName} 
                        secret={trueSecret} 
                      />
                    )}
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