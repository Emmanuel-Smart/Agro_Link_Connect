// import "../globals.css";
// import Navbar from "../components/Navbar/Navbar";

// export const metadata = {
//   title: "AgroLink",
//   description: "Connecting Farmers, Buyers, and Logistics",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <Navbar />
//         <main>{children}</main>
//       </body>
//     </html>
//   );
// }



// app/(public)/layout.tsx
import { AuthProvider } from "../context/AuthContext"; // go up one level from (public) to context
import NavManager from "../components/NavManager/NavManager"; // same, go up one level
import "../globals.css"; // correct relative path to globals.css

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavManager />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

