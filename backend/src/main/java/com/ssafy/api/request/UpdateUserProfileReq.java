package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@ApiModel("UpdateUserProfileRequest")
public class UpdateUserProfileReq {

    @NotEmpty
    @ApiModelProperty(name = "userName")
    String userName;

    @NotEmpty
    @ApiModelProperty(name = "userEmail")
    String userEmail;
}
