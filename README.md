<h1 align="center">Doggle: Your Best AI Finance helper🐶✨</h1>

## **Introduction**

This project developed an AI-powered web app for managing personal finances, featuring intuitive visual displays and an AI chatbot designed as a playful bookkeeping puppy. The chatbot supports voice, text, image, and file inputs, using finetuned Gemini APIs for bill processing and personalized financial advice. This app enhances traditional budgeting tools, making them faster, smarter, and more personalized with advanced AI.

## **Technologies Use**
1. **Frontend**: React, JavaScript
2. **UI Libraries**: Ant Design, ChatUI
3. **Backend**: Flask
4. **Database**: Firebase, Google Cloud MySQL
5. **AI Integration**: Finetuned Gemini APIs
6. **Hosting**: Firebase, Heroku

## **Core Features**

1. **SigninPage/SignupPage**

- **Functionality**: Require sign-in or sign-up for secure cloud storage of bill data. Collect personal details like age, gender, occupation, income sources, and financial goals to enable personalized financial advice from the AI bot.

2. **HomePage**

- **Functionality**: Display an overview of financial data, showing total income, expenses, and remaining budget by month and year. Provide a table for modifying or deleting individual expense and income entries.
  
3. **DashboardPage**

- **Functionality**: Provide detailed analysis of financial data. Users can select a month and year to view trends in income and expenses, with options to display data in line or bar charts.

4. **CalendarPage**

- **Functionality**: Display daily transaction data. By selecting a specific date on the calendar, users can view all income and expenses for that day in a table format, with options to modify or delete individual entries.

5. **ChatbotPage**

- **Functionality**: Offer an AI chatbot puppy for handling common FAQs, voice and text bill data inputs, image and file uploads, and understanding. Utilize finetuned Gemini APIs for chatbot style setting, processing, and CRUD operations, while providing personalized financial advice.

## Technical Highlights

1. **Secure User Authentication**: Utilize Firebase and Google Cloud SQL for secure sign-in/sign-up, ensuring data privacy and enabling CRUD operations for user information and bill records while providing personalized financial insights based on user-provided details.

2. **Comprehensive Data Visualization**: Offer a clear overview and detailed analysis of income, expenses, and budget trends with dynamic visualizations, allowing easy modifications and management of financial entries by month, year, or day.

3. **AI-Powered Chatbot**: Integrate an AI chatbot using finetuned Gemini models for real-time bill classification and personalized spending suggestions. Through prompt engineering, the chatbot is designed as a cute bookkeeping puppy that uses playful language to reduce financial management stress.

## Chatbot Use Examples

1. **Common Q&A**
- **User: What features does doggle support?**
- **Response**: I can help you with voice input 🎤, image recognition 📸, and file text recognition 📄. I also love analyzing your bills based on your personal info, helping you understand your spending habits, and giving you pawsome suggestions, woof! 🐶✨
- **User: How to start bookkeeping with doggle?**
- **Response**: First, fill in some basic info about yourself 💗. Then you can start bookkeeping! When you log an expense or income, just provide the date, event, and amount 📝. You can type it in or even bark it to me 🐾. Got a receipt? Snap a pic and upload it 📸. For bank statements, just upload the Excel or PDF file 📂. Let’s get your finances in order, woof! 🐶✨
- **User: How to view my bills?**
- **Response**: You can sniff out bill analysis on the dashboard page anytime to understand the proportion of spending categories, and daily, weekly, and monthly income and expenditure 📊. For detailed bills each day, just wag your way to the calendar page and click on the date 🗓️. Pawsome, woof! 🐶✨
- **User: How to edit or delete bills?**
- **Response**: Need to edit or delete bills? No worries! 🐾 If the bill was entered through conversation, just reply with the modification or deletion ✅. On the calendar page 📅, click on a specific date, find the bill entry, and then swipe left to edit or delete it manually 📝. Easy peasy, woof woof! 🐶✨

2. **CRUD Operations**
 - **User: Received $5000 salary yesterday, spent $50 on haircut, and $70 on groceries**
 - **Response**: Recorded. 🐾 Bill 1 Date: 2024-07-18, Category: Salary, Income: $5000, Description: salary, Account Book: Default account book; Bill 2 Date: 2024-07-18, Category: Beauty, Expense: $50, Description: haircut, Account Book: Default account book, Bill 3 Date: 2024-07-18, Category: Shopping, Expense: $70, Description: groceries, Account Book: Default account book.
 - **User: Edited $5000 salary yesterday to $3000**
 - **Response**: Edited. 🐾 Bill 1 Date: 2024-07-18, Category: Salary, Income: $5000, Description: salary yesterday, Account Book: Default account book.
 - **User: delete $5000 salary yesterday, spent $50 on haircut, and $70 on groceries**
 - **Response**: Deleted. 🐾

3. **Querying Detailed Income and Expense Data**
 - **User: How much did I spend on takeout this month?**
 - **Response**: You spent $300 on takeout this month, which is $50 more than your average spending this year, woof woof! 🐶✨
 - **User: How much did I earn on this year?**
 - **Response**: So far, you earned $80,000 from your job and $5,000 from your online e-shop business this year, which is $10,000 more than last year! **👩‍💻** Keep going, woof woof! 🐶✨

4. **Purchase Recommendations**
 - **User: I saw a pair of shoes on sale for $400, should I buy them?**
 - **Response1**:  Yes! You got a raise this month, and it’s been six months since your last big purchase. 💰 Your shopping expenses are in check, so if you love those shoes and the discount is great 👟, go for it,  woof! 🐶✨
 - **Response2**: No, you've already bought three pairs of shoes this month and overshot your shopping budget, that’s a lot! **😥** Plus, your goal is to save money, so it’s smarter to hold off on this purchase, woof! 🐶✨
 - **User: With my current savings, can I save $50,000 in three years?**
 - **Response1**: Yes! You’ve been saving $1,500 each month, so reaching your goal is totally doable. 💰 With your salary increase and lower rent, you might even save more! 💪 You’re on track to meet your goal in three years, woof! 🐶✨
 - **Response2**:  No, even though your salary increased, moving to a pricier city has doubled your expenses. 😥 Your monthly savings have dropped from $1500 to $800. 💸 If this trend continues, it will be tough to reach your goal in three years.  But don't worry, we'll find a way, woof! 🐶✨

## How to Run

1. **Frontend**

- Install dependencies

```bash
npm install
```

- Start the frontend server

```bash
npm run start
```

2. **Backend**

- Navigate to the backend directory

```bash
cd backend
```

- Create a virtual environment

```bash
python3 -m venv .venv
```

- Activate the virtual environment

```bash
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
```

- Install dependencies

```bash
pip install -r requirements.txt
```

- Run the Flask application

```bash
flask --app api run
```

## Links

- ([Demo Video](https://youtu.be/8D57UD3cWfo?si=xhHj6ELR5Tlrhy4y))

## Contributors

- **Xinyi Gao** [[Linkedin](https://www.linkedin.com/in/xinyi-gao-cn/)][[GitHub](https://github.com/Joan-gao)]: Product Design, UI/UX Design, Full-stack Development
- **Li Cui** [[Linkedin](https://www.linkedin.com/in/li-cui-73809027b)][[GitHub](https://github.com/amandaliberaann)]: Full-Stack Development, Database Management
- **Jiacheng Li** [[Linkedin](https://www.linkedin.com/in/jiacheng-li-b17b41242/)][[GitHub](https://github.com/ljc0359)]: AI Fine-Tuning, Backend Development
