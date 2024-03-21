'use client';

import Link from 'next/link';
import { Navbar } from 'flowbite-react';

// We can export the component right from the declaration line
// We MUST remember to name our component the same name as the file name
// In NextJS, this is how you do routing to different pages. This is the same as browser router in react, but it is simplified and built into NextJS to make things simpler. We only need the as={Link} and the href='/Path'
export default function NavbarComponent() {
    return (
        <Navbar fluid rounded>
            <Navbar.Collapse>
                <Navbar.Link as={Link} href="/">Login Page</Navbar.Link>
                <Navbar.Link as={Link} href="/BlogPage">Blog Page</Navbar.Link>
                <Navbar.Link as={Link} href="/Dashboard">Dashboard</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
