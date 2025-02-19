import { createContext, useContext, useEffect, useState } from "react";

const DetailsContext = createContext();

export function DetailsProvider({ children }) {
    const [services, setServices] = useState([]);
    const [companyDetails, setCompanyDetails] = useState(null);

    const BASE_URL_API =
        process.env.NODE_ENV === "development"
            ? process.env.NEXT_PUBLIC_API_URL_DEV
            : process.env.NEXT_PUBLIC_API_URL_PROD;

    const fetchServices = async () => {
        try {
            const res = await fetch(
                `${BASE_URL_API}/get-service/service-group`
            );
            const data = await res.json();
            setServices(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCompanyDetails = async () => {
        try {
            const res = await fetch(
                `${BASE_URL_API}/get/company-details`
            );
            const data = await res.json();
            setCompanyDetails(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBannerCMS = async (slug) => {
        try {
            const res = await fetch(
                `${BASE_URL_API}/banner-cms`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(slug),
                }
            );
            const data = await res.json();
            return data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCMS = async (slug) => {
        try {
            const res = await fetch(`${BASE_URL_API}/cms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(slug),
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchCompanyDetails();
    }, []);

    const value = {
        services,
        setServices,
        companyDetails,
        setCompanyDetails,
        fetchCMS,
        fetchBannerCMS,
        BASE_URL_API
    };

    return (
        <DetailsContext.Provider value={value}>
            {children}
        </DetailsContext.Provider>
    );
}

export function useDetails() {
    const context = useContext(DetailsContext);
    if (context === undefined) {
        throw new Error("useDetails must be used within a DetailsProvider");
    }
    return context;
}
