import { createNewUser } from "@/lib/actions/users";
import csvParser from "csv-parser";
import * as fs from "fs";
import formidable from "formidable";
import * as path from "path";
import { parse as jsonToCsv } from "json2csv";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organisme_code: string;
  // Add other fields as needed
}

// export const config = {
//   api: {
//     bodyParser: false, // Use formidable to handle file uploads
//   },
// };

const parseCsvFile = async (
  csvFilePath: string
): Promise<{ errors: UserData[]; total: number }> => {
  const errorsItems: UserData[] = [];

  return new Promise((resolve, reject) => {
    const results: UserData[] = [];

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (data: UserData) => {
        results.push(data);
      })
      .on("end", async () => {
        for (const user of results) {
          try {
            // await createNewUserNoForm(user)
            console.log(user);
          } catch (error) {
            errorsItems.push(user);
          }
        }
        resolve({ errors: errorsItems, total: results.length });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export async function POST(req: Request) {
  // const form = formidable({ multiples: false });

  const formData = await req.formData();
  const file = formData.get("csvFile");

  // Parse the uploaded file
  // const { files }: any = await new Promise((resolve, reject) => {
  //   form.parse(req, (err, fields, files) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve({ fields, files });
  //   });
  // });

  // const csvFile = files.csvFile;

  if (!file) {
    return NextResponse.json(
      { error: "No CSV file uploaded" },
      { status: 400 }
    );
  }

  const filePath = file;
  console.log(file);

  // Process the CSV file
  try {
    // @ts-ignore
    const { errors, total } = await parseCsvFile(file.name);

    if (errors.length > 0) {
      const errorFilePath = path.join(
        process.cwd(),
        "public",
        "error-items.csv"
      );
      const csv = jsonToCsv(errors);
      fs.writeFileSync(errorFilePath, csv);

      return NextResponse.json({
        message: `${total - errors.length} users processed successfully, ${
          errors.length
        } failed.`,
        errorFilePath: "/error-items.csv", // Path to download error file
      });
    } else {
      return NextResponse.json({
        message: `All ${total} users processed successfully`,
      });
    }
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Error processing CSV file" },
      { status: 500 }
    );
  }
}
