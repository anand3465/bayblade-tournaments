This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Staff roles (EMPLOYEE / ADMIN)

New sign-ups are assigned the `PLAYER` role by default.

**Become staff:** Players apply at `/apply/employee` with a cover letter and tournament history. Admins review at `/admin/applications` and approve to promote to `EMPLOYEE`.

**Tournament access:** Admins assign employees to specific tournaments at `/admin/tournaments/[id]/assignments`. Employees can only edit assigned tournaments; admins edit all events.

**Manual promotion (optional):** Set `User.role` to `EMPLOYEE` or `ADMIN` in Prisma Studio.

Players cannot add, edit, or remove parts in the database—they only select existing parts when creating builds.

### Optional email notifications (Resend)

When a player submits an application, admins can receive email if these env vars are set:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `APP_URL` (e.g. `http://localhost:3000`)
- `ADMIN_NOTIFY_EMAIL` (optional; otherwise emails all `ADMIN` users)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
