import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  try {
    await connectDB();
    return NextResponse.json({
      msg: ["Connectado a la base de datos"],
      success: true,
    })
  } catch (error) {
    if(error instanceof mongoose.Error.ValidationError) {
      let errorList = []
      for (let e in error.errors) {
        errorList.push(error.errors[e].message)
      }

      return NextResponse.json({ msg:errorList })
    } else {
      return NextResponse.json({ msg: "Unable to send message." })
    }
  }
}