import React, { useState } from "react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, phone, subject, message });

    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-28 pb-16 px-4 sm:px-8 md:px-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        GET IN TOUCH
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex flex-col gap-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-gray-700 font-semibold"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            className="w-full bg-white rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-gray-700 font-semibold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full bg-white rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-gray-700 font-semibold"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="number"
            placeholder="08XXXXXXXXXX"
            className="w-full bg-white rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 no-spinner"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block mb-2 text-gray-700 font-semibold"
          >
            Subject
          </label>
          <select
            id="subject"
            className="w-full bg-white rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-700"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="" disabled hidden>
              Select Subject
            </option>
            <option value="hire">Hire</option>
            <option value="critic">Critic and Advice</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block mb-2 text-gray-700 font-semibold"
          >
            Your Message
          </label>
          <textarea
            id="message"
            rows="6"
            placeholder="Write your message here..."
            className="w-full bg-white rounded-lg px-4 py-2 shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
          ></textarea>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-black text-white font-semibold px-6 py-2 rounded-full hover:bg-gray-800 transition-all"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
