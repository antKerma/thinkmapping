/*
*    Copyright [2011] [wisemapping]
*
*   Licensed under WiseMapping Public License, Version 1.0 (the "License").
*   It is basically the Apache License, Version 2.0 (the "License") plus the
*   "powered by wisemapping" text requirement on every single page;
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the license at
*
*       http://www.wisemapping.org/license
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

package com.wisemapping.dao;

import com.wisemapping.model.Collaborator;
import com.wisemapping.model.User;
import com.wisemapping.model.AccessAuditory;
import org.jetbrains.annotations.NotNull;

import java.util.List;

public interface UserManager {

    List<User> getAllUsers();

    User getUserBy(String email);

    public User getUserBy(long id);

    void createUser(User user);

    void auditLogin(@NotNull AccessAuditory accessAuditory);

    void updateUser(User user);

    User getUserByActivationCode(long code);

    public Collaborator getCollaboratorBy(String email);

    public User createUser(User user, Collaborator col);

    public void deleteUser(User user);

}
