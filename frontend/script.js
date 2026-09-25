/* =========================================================
   LEGISWATCH
   FRONTEND JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const checkButton =
    document.getElementById("checkButton");

const buttonText =
    document.getElementById("buttonText");

const statusText =
    document.getElementById("status");

const emailInput =
    document.getElementById("emailInput");

const results =
    document.getElementById("results");

const emptyState =
    document.getElementById("emptyState");

const resultCount =
    document.getElementById("resultCount");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const pageNumber =
    document.getElementById("pageNumber");


/* =========================================================
   SETTINGS
========================================================= */

const API_URL =
    "https://legiswatch-production.up.railway.app";

const limit = 5;

let currentPage = 1;

let currentSearch = "";


/* =========================================================
   LOAD LEGISLATION
========================================================= */

async function loadBills() {

    const offset =
        (currentPage - 1) * limit;


    /* API URL */

    const url =
        `${API_URL}/bills` +
        `?limit=${limit}` +
        `&offset=${offset}` +
        `&search=${encodeURIComponent(currentSearch)}`;


    /* LOADING */

    results.style.display = "none";

    emptyState.style.display = "none";

    resultCount.textContent =
        "იტვირთება...";


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Failed to load legislation."
            );

        }


        const bills =
            await response.json();


        renderBills(bills);

    }


    catch (error) {

        console.error(error);


        results.innerHTML = "";

        results.style.display = "none";

        emptyState.style.display = "block";

        emptyState.innerHTML = `
            <h3>Unable to load legislation</h3>
            <p>
                Please try again later.
            </p>
        `;

        resultCount.textContent =
            "0 შედეგი";

    }

}


/* =========================================================
   RENDER LEGISLATION
========================================================= */

function renderBills(bills) {

    results.innerHTML = "";


    /* NO RESULTS */

    if (bills.length === 0) {

        results.style.display = "none";

        emptyState.style.display = "block";

        emptyState.innerHTML = `
            <h3>No legislation found</h3>
            <p>
                Try another search.
            </p>
        `;

        resultCount.textContent =
            "0 შედეგი";

        previousButton.disabled =
            currentPage === 1;

        nextButton.disabled = true;

        pageNumber.textContent =
            currentPage;

        return;

    }


    /* RESULTS */

    emptyState.style.display = "none";

    results.style.display = "block";


    const start =
        (currentPage - 1) * limit + 1;

    const end =
        start + bills.length - 1;


    resultCount.textContent =
        `ნაჩვენებია ${start}–${end}`;


    /* RENDER EACH BILL */

    bills.forEach(
        function (bill) {


            const billUrl =
                `https://info.parliament.ge/#law-drafting/${bill.bill_id}`;


            const row =
                document.createElement(
                    "article"
                );


            row.className =
                "bill-row";


            row.innerHTML = `

                <div class="bill-name">

                    ${escapeHTML(
                        bill.bill_name
                    )}

                </div>


                <div>

                    <span class="bill-status">

                        ${escapeHTML(
                            bill.bill_type
                        )}

                    </span>

                </div>


                <div class="bill-info">

                    ${escapeHTML(
                        bill.registration_number
                    )}

                </div>


                <div class="bill-info">

                    ${escapeHTML(
                        bill.registration_date
                    )}

                </div>


                <div class="bill-arrow">

                    <a
                        href="${billUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        →

                    </a>

                </div>

            `;


            results.appendChild(
                row
            );

        }
    );


    /* PAGINATION */

    pageNumber.textContent =
        currentPage;


    previousButton.disabled =
        currentPage === 1;


    /*
        თუ ზუსტად limit რაოდენობის
        ჩანაწერი დაბრუნდა, შეიძლება
        შემდეგი გვერდიც არსებობდეს.
    */

    nextButton.disabled =
        bills.length < limit;

}


/* =========================================================
   SEARCH
========================================================= */

searchButton.addEventListener(
    "click",
    function () {

        currentSearch =
            searchInput.value.trim();

        currentPage = 1;

        loadBills();

    }
);


/* =========================================================
   ENTER = SEARCH
========================================================= */

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            currentSearch =
                searchInput.value.trim();

            currentPage = 1;

            loadBills();

        }

    }
);


/* =========================================================
   PAGINATION
========================================================= */

nextButton.addEventListener(
    "click",
    function () {

        currentPage++;

        loadBills();

    }
);


previousButton.addEventListener(
    "click",
    function () {

        if (currentPage > 1) {

            currentPage--;

            loadBills();

        }

    }
);


/* =========================================================
   CHECK FOR UPDATES
========================================================= */

checkButton.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();


        /* CHECK EMAIL */

        if (email === "") {

            statusText.textContent =
                "Please enter your email address.";

            emailInput.focus();

            return;

        }


        /* SIMPLE EMAIL CHECK */

        if (
            !email.includes("@") ||
            !email.includes(".")
        ) {

            statusText.textContent =
                "Please enter a valid email address.";

            emailInput.focus();

            return;

        }


        /* LOADING */

        checkButton.disabled =
            true;

        buttonText.textContent =
            "CHECKING...";

        statusText.textContent =
            "Checking parliamentary data...";


        try {

            const response =
                await fetch(
                    `${API_URL}/check-updates`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email: email
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Something went wrong."
                );

            }


            /* SUCCESS */

            statusText.textContent =
                "Updates checked successfully. Please check your email.";

        }


        catch (error) {

            console.error(error);

            statusText.textContent =
                "Unable to check updates. Please try again.";

        }


        finally {

            buttonText.textContent =
                "CHECK FOR UPDATES";

            checkButton.disabled =
                false;

        }

    }
);


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadBills();