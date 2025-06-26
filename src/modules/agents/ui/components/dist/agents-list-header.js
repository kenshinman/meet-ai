"use client";
"use strict";
exports.__esModule = true;
exports.ListHeader = void 0;
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var new_agent_dialog_1 = require("./new-agent-dialog");
var use_agents_filters_1 = require("../../hooks/use-agents-filters");
var agents_search_filter_1 = require("./agents-search-filter");
var constants_1 = require("@/lib/constants");
exports.ListHeader = function () {
    var _a = react_1.useState(false), isDialogOpen = _a[0], setIsDialogOpen = _a[1];
    var _b = use_agents_filters_1.useAgentsFilters(), filters = _b[0], setFilters = _b[1];
    var isAnyFilterModified = !!filters.search;
    var onClearFilters = function () {
        setFilters({
            search: "",
            page: constants_1.DEFAULT_PAGE
        });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(new_agent_dialog_1.NewAgentDialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen }),
        react_1["default"].createElement("div", { className: "py-4 px-4 md:px-8 flex flex-col gap-y-4" },
            react_1["default"].createElement("div", { className: "flex items-center justify-between" },
                react_1["default"].createElement("h5", { className: "font-medium text-xl" }, "My Agents"),
                react_1["default"].createElement(button_1.Button, { onClick: function () { return setIsDialogOpen(true); } },
                    react_1["default"].createElement(lucide_react_1.PlusIcon, null),
                    " New Agents")),
            react_1["default"].createElement("div", { className: "flex items-center gap-x-2 p-1" },
                react_1["default"].createElement(agents_search_filter_1.AgentsSearchFilter, null),
                isAnyFilterModified && (react_1["default"].createElement(button_1.Button, { variant: "outline", size: "sm", onClick: onClearFilters },
                    react_1["default"].createElement(lucide_react_1.XCircleIcon, null),
                    " Clear"))))));
};
