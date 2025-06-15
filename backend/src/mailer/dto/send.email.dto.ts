import { Address } from "nodemailer/lib/mailer"

// export class

// Purpose: Used to define classes with both structure and behavior (methods).
// Use Cases: Suitable for defining complex data structures that require methods, inheritance, or encapsulation.
// Implementation: You can define methods, constructors, and utilize access modifiers (public, private, protected).
// Instance Creation: Classes can be instantiated to create objects with their own state.

//export type

// Purpose: Used primarily for defining shapes or structures of data (like DTOs).
// Use Cases: Ideal for defining simple data structures, unions, intersections, or function types.
// No Implementation: It does not allow you to implement methods or contain logic. It only defines a structure.
// Lightweight: Generally more lightweight compared to classes, especially for simple data definitions.

export type SendEmailDto = {
    from?: Address,
    // recipients:Address[],
    recipients:Address
    subject:string,
    text?:string,
    placeholderReplacement?:Record<string,string>
}