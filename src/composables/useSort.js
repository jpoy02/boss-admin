export function useSort() {
  const sortOrderByRole = {
    bplo: [
      "BUSINESS TAX",
      "PENALTY",
      "SURCHARGE",
      "MAYOR'S PERMIT",
      "GARBAGE FEE",
      "TAX CLEARANCE",
      "FIRE INSPECTION FEE",
    ],
    mho: ["SANITARY PERMIT", "HEALTH CERTIFICATION", "WORKING PERMIT FEE"],
    mpdo: ["ZONING CLEARANCE"],
    meo: ["ANNUAL INSPECTION FEE"],
    other: [
      "OTHER FEES",
      "PERMIT FEE (STORAGE OF FLAMMABLE MAT)",
      "SIGNBOARD AND BILLBOARD FEES",
    ],
  };

  function getOrderIndex(account_title, role) {
    const roleOrder = sortOrderByRole[role] || [];

    for (let i = 0; i < roleOrder.length; i++) {
      if (account_title && account_title.includes(roleOrder[i])) {
        return i;
      }
    }
    return 999;
  }

  function splitByRole(applist) {
    const roleArrays = {
      bplo: [],
      mho: [],
      mpdo: [],
      meo: [],
      other: [],
    };

    // Filter items for each role based on account_title keywords
    applist.forEach((item) => {
      // Skip items without account_title
      if (!item || !item.account_title) {
        return;
      }

      for (const role in sortOrderByRole) {
        const keywords = sortOrderByRole[role];
        if (keywords.some((keyword) => item.account_title.includes(keyword))) {
          roleArrays[role].push(item);
          break; // item belongs to this role, stop checking other roles
        }
      }
    });

    // Sort each role's array
    for (const role in roleArrays) {
      roleArrays[role].sort((a, b) => {
        return (
          getOrderIndex(a.account_title, role) -
          getOrderIndex(b.account_title, role)
        );
      });
    }

    return roleArrays;
  }

  return {
    splitByRole,
    sortOrderByRole,
    getOrderIndex,
  };
}
