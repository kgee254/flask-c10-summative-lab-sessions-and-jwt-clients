import React, { useState } from "react";
import { Button, Error, Input, FormField, Label, Textarea } from "../styles";

function SignUpForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();
  setErrors([]);

  if (password !== passwordConfirmation) {
    setErrors(["Passwords do not match"]);
    return;
  }

  setIsLoading(true);

  try {
    // Register the new user.
    const signupResponse = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const signupData = await signupResponse.json();

    if (!signupResponse.ok) {
      setErrors([signupData.error || "Signup failed"]);
      return;
    }

    // Log in to obtain a JWT token.
    const loginResponse = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      setErrors([loginData.error || "Login failed after signup"]);
      return;
    }

    onLogin(loginData.access_token, loginData.user);
  } catch (error) {
    setErrors(["Unable to connect to the server. Please try again."]);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <form onSubmit={handleSubmit}>
      <FormField>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <FormField>
        <Label htmlFor="password">Password Confirmation</Label>
        <Input
          type="password"
          id="password_confirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <FormField>
        <Button type="submit">{isLoading ? "Loading..." : "Sign Up"}</Button>
      </FormField>
      <FormField>
        {errors.map((err) => (
          <Error key={err}>{err}</Error>
        ))}
      </FormField>
    </form>
  );
}

export default SignUpForm;
