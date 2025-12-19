"use client";
import React from "react";
import { useFormikContext, getIn } from "formik"; 
import { IRatingForm } from "@/helper/model/business";

interface StarRatingProps {
  name: string;
  max?: number;
}

function StarRating({ name, max = 5 }: StarRatingProps) {
  const { values, setFieldValue, touched, errors } = useFormikContext<IRatingForm>();
  const value = getIn(values, name);

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", cursor: "pointer" }}>
        {Array.from({ length: max }).map((_, index) => {
          const ratingValue = index + 1;
          return (
            <svg
              key={ratingValue}
              onClick={() => setFieldValue(name, ratingValue)}
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill={ratingValue <= value ? "#FFD700" : "none"}
              stroke="#FFD700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 
                18.18 21.02 12 17.77 5.82 21.02 
                7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          );
        })}
      </div>

      {/* Validation message */}
      {getIn(touched, name) && getIn(errors, name) && (
        <p style={{ color: "red", fontSize: "0.875rem", marginTop: "4px" }}>
          {getIn(errors, name)}
        </p>
      )}
    </div>
  );
}

export default StarRating;
