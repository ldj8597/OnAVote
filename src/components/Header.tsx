import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";

const links = [
  {
    text: "Home",
    target: "/",
  },
  {
    text: "Polls",
    target: "/poll",
  },
];

function Header() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-5">
      <Link href="/">
        <a>
          <h1 className="text-4xl text-indigo-500 font-bold">Votey</h1>
        </a>
      </Link>
      <ul className="flex items-center gap-5">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.target}>
              <a
                className={clsx("text-xl font-semibold", {
                  "text-indigo-500": router.pathname === link.target,
                })}
              >
                {link.text}
              </a>
            </Link>
          </li>
        ))}
        <button className="rounded-md text-xl bg-indigo-500 text-white px-3 py-1">
          Sign up
        </button>
      </ul>
    </div>
  );
}

export default Header;
