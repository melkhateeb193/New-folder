export const htm3 = (data) => {
  const { name, ViewerName, ViewerEmail, time, ViewerImg, link } = data;
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

        .profile {
            background-color: rgba(236, 236, 236, 0.726);
            font-weight: bold;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }

        .profile div {
            flex: 1;
            text-align: center;

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


        .content {
            padding: 30px;
            text-align: center;
        }

        .content h1 {
            font-size: 24px;
            margin: 0 0 10px;
        }

        .content p {
            color: #666666;
            font-size: 16px;
            line-height: 1.5;
        }

        .code {
            display: inline-block;
            background-color: #e8fdf4;
            color: #333333;
            font-weight: bold;
            font-size: 20px;
            padding: 10px 20px;
            margin: 20px 0;
            border-radius: 5px;
        }

        .button {
            display: inline-block;
            background-color: #1e78d6;
            color: rgb(255, 255, 255);
            text-decoration: none !important;
            font-size: 16px;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
            cursor: pointer
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
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h2>Hallo <span class="NameOf">${name}</span> </h2>
        </div>
        <div class="content">
            <h1>${ViewerName} has viewed your account 5 times at these time periods</h1>
            <div style="line-height: .5">
                ${time
                  .map((ele) => {
                    return `<h4>${ele}</h4>`;
                  })
                  .join("\n")}
            </div>


            <div class="profile">
                <img src="${ViewerImg}" alt="Profile Picture" width="100" height="100">
                <div>
                    <p>Name: ${ViewerName}</p>
                    <p>Email: ${ViewerEmail}</p>
                </div>
            </div>
              <a href="${link}" class="button">Block User</a>
        </div>
        <div class="footer">
            <p>Have a question or trouble logging in? Please contact us <a href="https://www.google.com/">here</a>.</p>
            <p>800 Bordway Suit 1500 cairo, NY 000423, Egypt</p>
            <p>Call us - 0123 456 789</p>
        </div>

    </div>
</body>

</html>
    
    
    `;
};
