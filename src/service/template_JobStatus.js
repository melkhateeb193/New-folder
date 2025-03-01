export const html4 = ({ name = "", text, companyName }) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .NameOf {
            color: rgb(88, 88, 88);
            margin-bottom: 10px;
            font-weight: bold;
            text-decoration: none !important;
            font-size: 30px;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
        }

        .header {
            background-color: #1e78d6;
            color: #ffffff;
            padding: 10px;
            text-align: center;
        }

        .logo {
            text-align: center;
            margin: 10px;

            padding: 0;

        }


        .content {
            padding: 30px;
            text-align: center;
        }

        .footer {
            background-color: rgb(114, 114, 114);
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: rgb(255, 255, 255);
        }

        .footer a {
            color: #1e78d6;
            text-decoration: none;
        }

        .footer2 {
            padding: 20px 20px 20px 20px;
            text-align: center;
            font-size: 14px;
        }

        .footer2 a {
            padding: 10px 9px;
            color: #fff;
            border-radius: 50%;
        }

        .footer2 span {
            padding: 10px 9px;
            color: #fff;
            border-radius: 50%;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="logo">
            <img width="100px"
                src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" />
        </div>
        <div class="header">
            <h2>${companyName}</h2>
            <h3>Hallo <span class="NameOf">${name}</span> </h3>
        </div>
        <div class="content">
            <h1>${text}</h1>

        </div>
        <div class="footer">
            <p>Have a question or trouble logging in? Please contact us <a href="https://www.google.com/">here</a>.</p>
            <p>800 Bordway Suit 1500 cairo, NY 000423, Egypt</p>
            <p>Call us - 0123 456 789</p>
        </div>
        <div class="footer2">

            <a href="${process.env.facebookLink}"><span>
                    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png"
                        width="50px" hight="50px"></span></a>

            <a href="${process.env.instegram}"><span>
                    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png"
                        width="50px" hight="50px"></span>
            </a>

            <a href="${process.env.twitterLink}"><span>
                    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png"
                        width="50px" hight="50px"></span>
            </a>

        </div>

    </div>
</body>

</html>
      
      
      
      `;
};
