import Link from "next/link";
import oops from "../../public/images/oops.png";
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-2">
        <Image src={oops} alt="404" width={600} height={600} />

        <Button variant="link">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </ThemeProvider>
  );
}
