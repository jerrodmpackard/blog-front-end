'use client'

import { useState } from "react";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useRouter } from "next/navigation";
import NavbarComponent from "./Components/NavbarComponent";
import { createAccount, getLoggedInUserData, login } from "@/utils/DataServices";
import { IToken } from "@/Interfaces/Interfaces";

// Be default, NextJS components are server side. (Server side components cannot have useStates in them)
// 'use client' turns the component into a client component

// The page.tsx inside of our app is our default home page

// For the purposes of this lecture, this will be our Login Page and our Create Account page

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [switchBool, setSwitchBool] = useState<boolean>(true);

  // When entering useRouter, make sure you hit enter on the one that says next/navigation
  const router = useRouter();

  // Creating a helper function to flip the state of our boolean value.
  // This will toggle between our Login and Create Account screen
  const handleSwitch = () => {
    setSwitchBool(!switchBool);
  }

  const handleSubmit = async () => {

    let userData = {
      // Putting our user data inside of an object so we can put it into our Post fetch later on
      username: username,
      password: password
    }

    if (switchBool) {
      // Create account logic in here
      createAccount(userData);

    } else {
      // Login login in here

      let token: IToken = await login(userData);

      console.log(token);

      // Check to see if logged in
      if (token.token != null) {
        // If we do successfully login, we want to navigate to our dashboard page
        // Before we do that, we want to save our token to local storage
        localStorage.setItem('Token', token.token);
        // Then we call getLoggedInUserData and pass in our username (our useState)
        getLoggedInUserData(username);
      } else {
        alert('Login Failed');
      }

      router.push('/Dashboard')
    }
  }


  return (
    <>
      <NavbarComponent />

      <div className="grid grid-flow-row justify-center mt-20">
        <div className="bg bg-slate-400 min-w-96 p-8 rounded-lg">
          {/* Ternary: if the boolean is true, it will render the left side of the colon. Else, it will render the right side */}
          {/* If switchBool is true, render 'Create Account'. Otherwise, render 'Login' */}
          <h1 className="text-3xl text-center">{switchBool ? 'Create Account' : 'Login'}</h1>
          <form className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              {/* e does not need a type because it is alredy inferred */}
              <TextInput id="username" type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" />
              </div>
              <TextInput id="password1" type="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSwitch} color='light'>{switchBool ? 'Already have an Account?' : 'Sign up'}</Button>
            </div>
            <Button onClick={handleSubmit}>Submit</Button>
          </form>
        </div>
      </div>
    </>
  );
}
